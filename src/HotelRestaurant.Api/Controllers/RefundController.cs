using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Application.DTOs.RefundRecord;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RefundController : ControllerBase
    {
        private readonly IRefundService _refundService;

        public RefundController(IRefundService refundService)
        {
            _refundService = refundService;
        }

        // 🔍 ৩টি ভিন্ন পেজের লিস্ট ডাটা টানার জন্য (api/Refund?status=0 বা 1 বা 2)
        [HttpGet]
        public async Task<IActionResult> GetRefunds([FromQuery] RefundStatus status)
        {
            var data = await _refundService.GetRefundsByStatusAsync(status);
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _refundService.GetRefundByIdAsync(id);
            if (data == null) return NotFound(new { message = "Record Not Found" });
            return Ok(data);
        }

        // 🎯 ৩টি পেজের যেকোনো পপ-আপ ফর্ম থেকে নতুন ডাটা সাবমিট বা এডিট করার জন্য
        [HttpPost]
        public async Task<IActionResult> SaveRefund([FromBody] UpsertRefundRecordDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _refundService.SaveRefundRecordAsync(dto);
            return Ok(new { message = "Refund log saved successfully", data = result });
        }

        // 🔄 একটা রোর স্ট্যাটাস চেঞ্জ করে পরবর্তী পেজে ট্রান্সফার করার জন্য (যেমন: Due থেকে Process-এ পাঠানো)
        [HttpPut("{id}/change-status")]
        public async Task<IActionResult> ChangeStatus(int id, [FromQuery] RefundStatus status)
        {
            var success = await _refundService.UpdateRefundStatusAsync(id, status);
            if (!success) return BadRequest(new { message = "Failed to advance stage" });
            return Ok(new { message = "Lifecycle stage updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _refundService.DeleteRefundAsync(id);
            if (!success) return NotFound(new { message = "Record not found" });
            return Ok(new { message = "Record deleted successfully" });
        }
    }
}