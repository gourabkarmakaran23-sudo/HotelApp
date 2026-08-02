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
        public async Task<IActionResult> GetLookup()
        {
            var result = await _hotelService.GetLookupAsync();
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
            var result = await _hotelService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}