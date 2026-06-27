using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.OtherPayment;
using HotelRestaurant.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OtherPaymentController : ControllerBase
    {
        private readonly IOtherPaymentService _invoiceService;

        public OtherPaymentController(IOtherPaymentService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetInvoices()
        {
            var result = await _invoiceService.GetAllInvoicesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvoice(int id)
        {
            var result = await _invoiceService.GetInvoiceByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] OtherPaymentInvoiceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            
            var generatedId = await _invoiceService.CreateInvoiceAsync(dto);
            return Ok(new { id = generatedId, message = "Other Revenue Invoice Document Saved Successfully!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var deleted = await _invoiceService.DeleteInvoiceAsync(id);
            if (!deleted) return NotFound();
            return Ok(true);
        }
    }
}