using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Common;
using HotelRestaurant.Application.DTOs.Rooms;
using HotelRestaurant.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
// 1. ADD THIS IMPORT FOR FLUENTVALIDATION
using FluentValidation;

namespace HotelRestaurant.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly ILogger<RoomController> _logger;

        // 2. DECLARE THE VALIDATOR FIELDS
        private readonly IValidator<CreateRoomDto> _createValidator;
        private readonly IValidator<UpdateRoomDto> _updateValidator;

        // 3. INJECT THEM VIA THE CONSTRUCTOR
        public RoomController(
            IRoomService roomService,
            ILogger<RoomController> logger,
            IValidator<CreateRoomDto> createValidator,
            IValidator<UpdateRoomDto> updateValidator)
        {
            _roomService = roomService;
            _logger = logger;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] FIlterDto filter)
        {
            try
            {
                var rooms = await _roomService.GetAllAsync(filter);
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching rooms with filter: {@Filter}", filter);
                return StatusCode(500, "An error occurred while fetching rooms.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var room = await _roomService.GetByIdAsync(id);
                if (room == null) return NotFound();
                return Ok(room);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching room with ID: {RoomId}", id);
                return StatusCode(500, "An error occurred while fetching the room.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRoomDto createRoomDto)
        {
            try
            {
                // 4. USE IT TO EXPLICITLY VALIDATE INCOMING DATA
                var validationResult = await _createValidator.ValidateAsync(createRoomDto);
                if (!validationResult.IsValid)
                {
                    // Returns a 400 Bad Request with precise error messages if validation fails
                    return BadRequest(validationResult.ToDictionary());
                }

                var createdRoom = await _roomService.CreateAsync(createRoomDto);
                return CreatedAtAction(nameof(GetById), new { id = createdRoom.Id }, createdRoom);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room with data: {@CreateRoomDto}", createRoomDto);
                return StatusCode(500, "An error occurred while creating the room.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRoomDto updateRoomDto)
        {
            try
            {
                if (id != updateRoomDto.Id)
                {
                    return BadRequest("ID in URL does not match ID in body.");
                }

                // 5. USE IT TO VALIDATE UPDATE DATA
                var validationResult = await _updateValidator.ValidateAsync(updateRoomDto);
                if (!validationResult.IsValid)
                {
                    return BadRequest(validationResult.ToDictionary());
                }

                var updatedRoom = await _roomService.UpdateAsync(updateRoomDto);
                if (updatedRoom == null)
                {
                    return NotFound();
                }
                return Ok(updatedRoom);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room with ID: {RoomId}", id);
                return StatusCode(500, "An error occurred while updating the room.");
            }
        }

        [HttpGet("by-roomtype/{roomTypeId}")]
        public async Task<IActionResult> GetRoomsByRoomType(int roomTypeId)
        {
            try
            {
                var rooms = await _roomService.GetRoomsByRoomTypeAsync(roomTypeId);
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching rooms by room type");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}