using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Common;
using HotelRestaurant.Application.DTOs.Rooms;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IRoomService
    {
        Task<PageResultDto<RoomDto>> GetAllAsync(FIlterDto filter);
        Task<RoomDto?> GetByIdAsync(int id);
        Task<RoomDto> CreateAsync(CreateRoomDto createRoomDto);
        Task<RoomDto?> UpdateAsync(UpdateRoomDto updateRoomDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<RoomDto>> GetAvailableRoomsAsync(DateTime checkIn, DateTime checkOut);

        Task<bool> UpdateRoomStatusAsync(int roomId, RoomStatus newStatus);

        




    }
}