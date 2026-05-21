using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HotelRestaurant.Application.DTOs.Common;
using HotelRestaurant.Application.DTOs.RoomTypes;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class RoomTypeService : IRoomTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        private readonly ILogger<RoomService> _logger;

        public RoomTypeService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<RoomService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public Task<ApiResponseDto<IEnumerable<RoomTypeDto>>> GetAllAsync()
        {
            try
            {
                _logger.LogInformation("Fetching all room types");
                var roomTypes = _unitOfWork.RoomTypes.GetAllAsync();
                var roomTypeDtos = _mapper.Map<IEnumerable<RoomTypeDto>>(roomTypes);
                return Task.FromResult(ApiResponseDto<IEnumerable<RoomTypeDto>>.SuccessResponse(roomTypeDtos));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all room types");
                return Task.FromResult(ApiResponseDto<IEnumerable<RoomTypeDto>>.FailureResponse("Failed to fetch room types."));
            }
        }

        public Task<ApiResponseDto<RoomTypeDto?>> GetByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation("Fetching room type with ID: {RoomTypeId}", id);
                var roomType = _unitOfWork.RoomTypes.GetByIdAsync(id);
                if (roomType == null)
                {
                    return Task.FromResult(ApiResponseDto<RoomTypeDto?>.FailureResponse("Room type not found."));
                }
                var roomTypeDto = _mapper.Map<RoomTypeDto>(roomType);
                return Task.FromResult(ApiResponseDto<RoomTypeDto?>.SuccessResponse(roomTypeDto));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching room type with ID: {RoomTypeId}", id);
                return Task.FromResult(ApiResponseDto<RoomTypeDto?>.FailureResponse("Failed to fetch room type."));
            }
        }

        public Task<ApiResponseDto<RoomTypeDto>> CreateAsync(CreateRoomTypeDto createRoomTypeDto)
        {
            try
            {
                _logger.LogInformation("Creating new room type with data: {@CreateRoomTypeDto}", createRoomTypeDto);
                var roomType = _mapper.Map<Core.Entities.RoomTypes>(createRoomTypeDto);
                _unitOfWork.RoomTypes.AddAsync(roomType);
                _unitOfWork.SaveChangesAsync();
                var roomTypeDto = _mapper.Map<RoomTypeDto>(roomType);
                return Task.FromResult(ApiResponseDto<RoomTypeDto>.SuccessResponse(roomTypeDto));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new room type with data: {@CreateRoomTypeDto}", createRoomTypeDto);
                return Task.FromResult(ApiResponseDto<RoomTypeDto>.FailureResponse("Failed to create room type."));
            }
        }

        public async Task<ApiResponseDto<RoomTypeDto?>> UpdateAsync(UpdateRoomTypeDto updateRoomTypeDto)
        {
            try
            {
                _logger.LogInformation("Updating room type with ID: {RoomTypeId} using data: {@UpdateRoomTypeDto}", updateRoomTypeDto.Id, updateRoomTypeDto);
                var existingRoomType = await _unitOfWork.RoomTypes.GetByIdAsync(updateRoomTypeDto.Id);
                if (existingRoomType == null)
                {
                    _logger.LogWarning("Room type with ID: {RoomTypeId} not found for update", updateRoomTypeDto.Id);
                    return ApiResponseDto<RoomTypeDto?>.FailureResponse("Room type not found.");
                }
                _mapper.Map(updateRoomTypeDto, existingRoomType);
                _unitOfWork.RoomTypes.Update(existingRoomType);
                await _unitOfWork.SaveChangesAsync();
                var roomTypeDto = _mapper.Map<RoomTypeDto>(existingRoomType);
                return ApiResponseDto<RoomTypeDto?>.SuccessResponse(roomTypeDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room type with ID: {RoomTypeId} using data: {@UpdateRoomTypeDto}", updateRoomTypeDto.Id, updateRoomTypeDto);
                return ApiResponseDto<RoomTypeDto?>.FailureResponse("Failed to update room type.");
            }
        }

        public async Task<ApiResponseDto<bool>> DeleteAsync(int id)
        {
            try
            {
                _logger.LogInformation("Deleting room type with ID: {RoomTypeId}", id);
                var existingRoomType = await _unitOfWork.RoomTypes.GetByIdAsync(id);
                if (existingRoomType == null)
                {
                    _logger.LogWarning("Room type with ID: {RoomTypeId} not found for deletion", id);
                    return ApiResponseDto<bool>.FailureResponse("Room type not found.");
                }
                _unitOfWork.RoomTypes.Delete(existingRoomType);
                await _unitOfWork.SaveChangesAsync();
                return ApiResponseDto<bool>.SuccessResponse(true, "Room type deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room type with ID: {RoomTypeId}", id);
                return ApiResponseDto<bool>.FailureResponse("Failed to delete room type.");
            }

        }

    }
}