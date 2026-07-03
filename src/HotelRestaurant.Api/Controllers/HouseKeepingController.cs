// File: HouseKeepingController.cs
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HouseKeepingController : ControllerBase
    {
        private readonly IHouseKeepingService _hkService;

        public HouseKeepingController(IHouseKeepingService hkService)
        {
            _hkService = hkService;
        }

        // --- Room Cleaning endpoints ---
        [HttpGet("cleanings")]
        public async Task<IActionResult> GetCleanings() => Ok(await _hkService.GetAllCleaningsAsync());

        [HttpPost("cleanings/save")]
        public async Task<IActionResult> SaveCleaning([FromBody] RoomCleaningDto dto) => Ok(await _hkService.SaveCleaningAsync(dto));

        [HttpDelete("cleanings/delete/{id}")]
        public async Task<IActionResult> DeleteCleaning(int id) => Ok(await _hkService.DeleteCleaningAsync(id));

        // --- Checklist endpoints ---
        [HttpGet("checklist")]
        public async Task<IActionResult> GetChecklist() => Ok(await _hkService.GetChecklistAsync());

        [HttpPost("checklist/save")]
        public async Task<IActionResult> SaveChecklist([FromBody] ChecklistDto dto) => Ok(await _hkService.SaveChecklistAsync(dto));

        [HttpDelete("checklist/delete/{id}")]
        public async Task<IActionResult> DeleteChecklist(int id) => Ok(await _hkService.DeleteChecklistAsync(id));

        // --- Laundry endpoints ---
        [HttpGet("laundry/logs")]
        public async Task<IActionResult> GetLaundryLogs() => Ok(await _hkService.GetAllLaundryLogsAsync());

        [HttpPost("laundry/logs/save")]
        public async Task<IActionResult> SaveLaundryLog([FromBody] LaundryLogDto dto) => Ok(await _hkService.SaveLaundryLogAsync(dto));

        [HttpGet("laundry/payments")]
        public async Task<IActionResult> GetLaundryPayments() => Ok(await _hkService.GetAllLaundryPaymentsAsync());

        [HttpPost("laundry/payments/save")]
        public async Task<IActionResult> SaveLaundryPayment([FromBody] LaundryPaymentDto dto) => Ok(await _hkService.SaveLaundryPaymentAsync(dto));

        [HttpDelete("laundry/payments/delete/{id}")]
        public async Task<IActionResult> DeleteLaundryPayment(int id) => Ok(await _hkService.DeleteLaundryPaymentAsync(id));

        // --- 🚀 QR CODE STREAM FETCH ---
        [HttpGet("room-qr/{roomNo}")]
        public IActionResult GetRoomQr(string roomNo)
        {
            var qrBytes = _hkService.GenerateRoomQrCode(roomNo);
            return File(qrBytes, "image/png"); // সরাসরি ব্রাউজার বা ফ্রন্টএন্ড ইমেজে বাইন্ড করার উপযোগী ইমেজ ফাইল স্ট্রীম
        }
    }
}

//using QRCoder; // NuGet Package: Install-Package QRCoder