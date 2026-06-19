using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Common;
using HotelRestaurant.Application.DTOs.RoomTypes;
using HotelRestaurant.Application.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelRestaurant.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomTypeController : ControllerBase
    {
        private readonly IRoomTypeService _roomTypeService;
        private readonly ILogger<RoomTypeController> _logger;
        public RoomTypeController(IRoomTypeService roomTypeService, ILogger<RoomTypeController> logger)
        {
            _roomTypeService = roomTypeService;
            _logger = logger;
        }
        [HttpGet]
        public async Task<ActionResult<ApiResponseDto<List<RoomTypeDto>>>> GetAll()
        {
            try
            {
                var roomTypes = await _roomTypeService.GetAllAsync();
                return Ok(roomTypes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all room types.");
                return new ApiResponseDto<List<RoomTypeDto>>()
                {
                    Success = false,
                    Message = "An error occurred while retrieving room types."
                };
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<RoomTypeDto>>> GetById(int id)
        {
            try
            {
                var roomType = await _roomTypeService.GetByIdAsync(id);
                if (roomType == null)
                {
                    return NotFound(new ApiResponseDto<RoomTypeDto>()
                    {
                        Success = false,
                        Message = "Room type not found."
                    });
                }
                return Ok(roomType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting room type by ID.");
                return new ApiResponseDto<RoomTypeDto>()
                {
                    Success = false,
                    Message = "An error occurred while retrieving the room type."
                };
            }
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<RoomTypeDto>>> Create(CreateRoomTypeDto createRoomTypeDto)
        {
            try
            {
                var createdRoomType = await _roomTypeService.CreateAsync(createRoomTypeDto);

                // Check if the service failed or returned a null response structure
                if (createdRoomType == null || !createdRoomType.Success || createdRoomType.Data == null)
                {
                    return BadRequest(new ApiResponseDto<RoomTypeDto>()
                    {
                        Success = false,
                        Message = createdRoomType?.Message ?? "Failed to create the room type in the system database."
                    });
                }

                return CreatedAtAction(nameof(GetById), new { id = createdRoomType.Data.Id }, createdRoomType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating a new room type.");
                return StatusCode(500, new ApiResponseDto<RoomTypeDto>()
                {
                    Success = false,
                    Message = $"An error occurred while creating the room type: {ex.Message}"
                });
            }
        }

        [HttpPut]
        public async Task<ActionResult<ApiResponseDto<RoomTypeDto>>> Update(UpdateRoomTypeDto updateRoomTypeDto)
        {
            try
            {
                var updatedRoomType = await _roomTypeService.UpdateAsync(updateRoomTypeDto);
                if (updatedRoomType == null)
                {
                    return NotFound(new ApiResponseDto<RoomTypeDto>()
                    {
                        Success = false,
                        Message = "Room type not found for update."
                    });
                }
                return Ok(updatedRoomType);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating the room type.");
                return new ApiResponseDto<RoomTypeDto>()
                {
                    Success = false,
                    Message = "An error occurred while updating the room type."
                };
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> Delete(int id)
        {
            try
            {
                var deleted = await _roomTypeService.DeleteAsync(id);
                // if (!deleted)
                if (!deleted.Success)
                {
                    return NotFound(new ApiResponseDto<bool>()
                    {
                        Success = false,
                        Message = "Room type not found for deletion."
                    });
                }
                return Ok(new ApiResponseDto<bool>()
                {
                    Success = true,
                    Message = "Room type deleted successfully."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting the room type.");
                return new ApiResponseDto<bool>()
                {
                    Success = false,
                    Message = "An error occurred while deleting the room type."
                };
            }
        }
    }
}