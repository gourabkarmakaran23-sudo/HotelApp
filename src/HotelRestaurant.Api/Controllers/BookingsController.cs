using Microsoft.AspNetCore.Mvc;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Core.Interfaces;
using System.Threading.Tasks;
using System;

namespace HotelRestaurant.Api.Controllers
{
    [ApiController]
    // HARDCODE THE ROUTE STRING DIRECTLY - DO NOT USE [controller] Token
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public BookingsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // LEAVE ROUTE BALK BLANK SO IT PINPOINTS ABSOLUTE BASE URL ROUTE ("api/bookings")
        [HttpPost("")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            if (dto == null)
                return BadRequest("Payload data cannot be empty.");

            try
            {
                // Validate string fields to protect against database NOT NULL column constraints
                string validatedFirstName = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingFirstName : dto.PrimaryFirstName) ? "WalkIn" : (dto.SameAsCustomer ? dto.BillingFirstName : dto.PrimaryFirstName);
                string validatedLastName = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingLastName : dto.PrimaryLastName) ? "Guest" : (dto.SameAsCustomer ? dto.BillingLastName : dto.PrimaryLastName);
                string validatedPhone = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingMobile : dto.PrimaryMobile) ? "0000000000" : (dto.SameAsCustomer ? dto.BillingMobile : dto.PrimaryMobile);

                // 1. Create the Guest Entity
                var guest = new Guest
                {
                    FirstName = validatedFirstName,
                    LastName = validatedLastName,
                    Phone = validatedPhone,
                    Email = string.IsNullOrWhiteSpace(dto.Email) ? "no-email@hotel.com" : dto.Email,
                    Address = string.IsNullOrWhiteSpace(dto.BillingAddress) ? "Not Provided" : dto.BillingAddress,
                    NationalId = "PENDING_ID_SCAN",
                    DateOfBirth = new DateTime(1990, 1, 1)
                };

                await _unitOfWork.Guests.AddAsync(guest);

                // 2. Find matching Room record
                var roomsList = await _unitOfWork.Rooms.GetAllAsync();
                var roomEntity = roomsList.FirstOrDefault(r => r.RoomNumber.Trim() == dto.RoomNo.Trim());

                if (roomEntity == null)
                    return NotFound($"Database validation failed: Assigned Room number '{dto.RoomNo}' was not found.");

                // Persist midpoint data so EF Core materializes the new auto-incremented Guest.Id
                await _unitOfWork.SaveChangesAsync();

                // 3. Build the Reservation entity
                var notesSummary = $"Type: {dto.BookingType} | Ref: {dto.BookingReference} | Sold By: {dto.SoldBy} | Plan: {dto.MealPlan} | Profile: {dto.CustomerProfile} | Visit Purpose: {dto.PurposeOfVisit} | Remarks: {dto.Remarks}".Trim();

                var reservation = new Reservation
                {
                    GuestId = guest.Id,
                    RoomId = roomEntity.Id,
                    CheckInDate = dto.CheckIn == DateTime.MinValue ? DateTime.UtcNow : dto.CheckIn,
                    CheckOutDate = dto.CheckOut == DateTime.MinValue ? DateTime.UtcNow.AddDays(1) : dto.CheckOut,
                    Adults = dto.Adults <= 0 ? 1 : dto.Adults,
                    Children = dto.Children,
                    TotalAmount = dto.TotalAmount,
                    Status = ReservationStatus.Pending,
                    Notes = notesSummary
                };

                await _unitOfWork.Reservations.AddAsync(reservation);

                // Transition room availability status
                roomEntity.Status = RoomStatus.Reserved;

                // Save reservation to materialize its auto-incremented Reservation.Id
                await _unitOfWork.SaveChangesAsync();

                // 4. Compute Invariant tax allocations and create checking Invoice entity record
                decimal computedTax = dto.TotalAmount * 0.05m;
                decimal computedTotal = dto.TotalAmount + computedTax;

                var invoice = new Invoice
                {
                    ReservationId = reservation.Id,
                    InvoiceDate = DateTime.UtcNow,
                    Subtotal = dto.TotalAmount,
                    Tax = computedTax,
                    Total = computedTotal,
                    PaymentStatus = dto.AdvanceAmount >= computedTotal ? PaymentStatus.Paid :
                                    dto.AdvanceAmount > 0 ? PaymentStatus.PartiallyPaid : PaymentStatus.Unpaid
                };

                await _unitOfWork.Invoices.AddAsync(invoice);

                // Final database commit transaction
                await _unitOfWork.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    bookingId = reservation.Id,
                    guestId = guest.Id,
                    invoiceId = invoice.Id
                });
            }
            catch (Exception ex)
            {
                var internalMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Internal Database Error: {internalMessage}");
            }
        }
    }
}