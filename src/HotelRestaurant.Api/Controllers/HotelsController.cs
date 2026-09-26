using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Application.Services.Interfaces;

namespace HotelRestaurant.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelsController : ControllerBase
    {
        private readonly IHotelService _hotelService;

        public HotelsController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        // GET: api/hotels/lookup
        [HttpGet("lookup")]
        [AllowAnonymous] // Public endpoint so Angular Login dropdown can load options before sign-in
        public async Task<IActionResult> GetLookup([FromQuery] int? companyId = null)
        {
            if (User.Identity?.IsAuthenticated == true && !IsSuperAdmin())
            {
                companyId = GetClaimId("company_id");
            }

            var result = await _hotelService.GetLookupAsync();
            if (companyId.HasValue && companyId.Value > 0)
            {
                var hotels = await _hotelService.GetAllAsync();
                var allowedHotelIds = hotels
                    .Where(h => h.CompanyId == companyId.Value)
                    .Select(h => h.Id)
                    .ToHashSet();
                result = result.Where(h => allowedHotelIds.Contains(h.Id));
            }

            if (User.Identity?.IsAuthenticated == true && User.IsInRole("User"))
            {
                var assignedHotelId = GetClaimId("hotel_id");
                result = assignedHotelId.HasValue
                    ? result.Where(h => h.Id == assignedHotelId.Value)
                    : Enumerable.Empty<HotelLookupDto>();
            }

            return Ok(result);
        }

        // GET: api/hotels
        [HttpGet]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _hotelService.GetAllAsync();
            return Ok(result);
        }

        // POST: api/hotels
        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Create([FromBody] CreateHotelDto dto)
        {
            var result = await _hotelService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // GET: api/hotels/1
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            if (!IsSuperAdmin() && GetClaimId("hotel_id") != id)
            {
                return Forbid();
            }

            var result = await _hotelService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        private bool IsSuperAdmin() => User.IsInRole("SuperAdmin");

        private int? GetClaimId(string claimType)
        {
            return int.TryParse(User.FindFirst(claimType)?.Value, out var id) ? id : null;
        }
    }
}