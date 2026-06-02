using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public PaymentsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<IActionResult> GetByBooking(int bookingId)
        {
            var payments = await _unitOfWork.Payments.GetAllQueryable()
                .Where(p => p.BookingId == bookingId)
                .Select(p => new {
                    p.Id,
                    p.ReceiptNo,
                    p.PaymentDate,
                    p.Amount,
                    PaymentMode = p.Method.ToString(),
                    p.Remarks,
                    p.InvoiceId
                }).ToListAsync();

            return Ok(payments);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PaymentDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!dto.BookingId.HasValue) return BadRequest("BookingId is required.");

            var booking = await _unitOfWork.Bookings.GetByIdAsync(dto.BookingId.Value);
            if (booking == null) return NotFound($"Booking {dto.BookingId.Value} not found.");

            var invoiceId = dto.InvoiceId;
            if (!invoiceId.HasValue)
            {
                var invoice = await _unitOfWork.Invoices.GetAllQueryable()
                    .Where(i => i.BookingId == dto.BookingId.Value)
                    .OrderByDescending(i => i.Id)
                    .FirstOrDefaultAsync();
                invoiceId = invoice?.Id;
            }

            var payment = new Payment
            {
                BookingId = dto.BookingId.Value,
                InvoiceId = invoiceId,
                ReceiptNo = string.IsNullOrWhiteSpace(dto.ReceiptNo) ? GenerateReceiptNumber(dto.BookingId.Value) : dto.ReceiptNo!.Trim(),
                PaymentDate = dto.PaymentDate ?? DateTime.UtcNow,
                Amount = dto.Amount,
                Remarks = dto.Remarks?.Trim() ?? string.Empty,
                Method = Enum.TryParse<PaymentMethod>(dto.PaymentMode, true, out var pm) ? pm : PaymentMethod.Cash
            };

            await _unitOfWork.Payments.AddAsync(payment);
            await _unitOfWork.SaveChangesAsync();

            if (payment.InvoiceId.HasValue)
            {
                var invoice = await _unitOfWork.Invoices.GetByIdAsync(payment.InvoiceId.Value);
                if (invoice != null)
                {
                    invoice.PaidAmount += payment.Amount;
                    invoice.DueAmount = Math.Max(0, invoice.Total - invoice.PaidAmount);
                    invoice.PaymentStatus = invoice.DueAmount == 0
                        ? PaymentStatus.Paid
                        : (invoice.PaidAmount > 0 ? PaymentStatus.PartiallyPaid : PaymentStatus.Unpaid);

                    _unitOfWork.Invoices.Update(invoice);
                    await _unitOfWork.SaveChangesAsync();
                }
            }

            return Ok(new { success = true, id = payment.Id, receiptNo = payment.ReceiptNo });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var p = await _unitOfWork.Payments.GetByIdAsync(id);
            if (p == null) return NotFound();

            _unitOfWork.Payments.Delete(p);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new { success = true });
        }

        private static string GenerateReceiptNumber(int bookingId)
        {
            return $"REC-{DateTime.UtcNow:yyyyMMddHHmmss}-{bookingId}-{new Random().Next(100, 999)}";
        }
    }

    public class PaymentDto
    {
        [Required]
        public int? BookingId { get; set; }

        public int? InvoiceId { get; set; }

        public string? ReceiptNo { get; set; }

        public DateTime? PaymentDate { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string? PaymentMode { get; set; }

        public string? Remarks { get; set; }
    }
}
