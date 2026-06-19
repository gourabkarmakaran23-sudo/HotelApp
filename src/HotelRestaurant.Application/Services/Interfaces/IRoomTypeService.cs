using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Common;
using HotelRestaurant.Application.DTOs.RoomTypes;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IRoomTypeService
    {
        Task<ApiResponseDto<IEnumerable<RoomTypeDto>>> GetAllAsync();
        Task<ApiResponseDto<RoomTypeDto?>> GetByIdAsync(int id);

        Task<ApiResponseDto<RoomTypeDto>> CreateAsync(CreateRoomTypeDto createRoomTypeDto);
        Task<ApiResponseDto<RoomTypeDto?>> UpdateAsync(UpdateRoomTypeDto updateRoomTypeDto);
        Task<ApiResponseDto<bool>> DeleteAsync(int id);
    }
}