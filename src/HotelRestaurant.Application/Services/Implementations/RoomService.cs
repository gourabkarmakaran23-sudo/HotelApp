using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HotelRestaurant.Application.DTOs.Common;
using HotelRestaurant.Application.DTOs.Rooms;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Interfaces;
using Microsoft.AspNetCore.Components.Forms.Mapping;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class RoomService:IRoomService
    {
       private readonly IUnitOfWork _unitOfWork;
       private readonly IMapper _mapper;

       private readonly ILogger<RoomService> _logger;

        public RoomService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<RoomService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PageResultDto<RoomDto>> GetAllAsync(FIlterDto filter)
        {
            try
            {
                _logger.LogInformation("Fetching rooms with filter: {@Filter}", filter);    
            var rooms = await _unitOfWork.Rooms.GetPagedAsync(
                filter.PageNumber, 
                filter.PageSize, 
                r => string.IsNullOrEmpty(filter.SearchTerm) || 
                r.RoomNumber.Contains(filter.SearchTerm), 
                null,
                null
                // query => query.Include(q => q.RoomType)
                );
            var roomDtos = _mapper.Map<IEnumerable<RoomDto>>(rooms.Items);
            var result = new PageResultDto<RoomDto>
            {
                Items = roomDtos,
                TotalCount = rooms.TotalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
            return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching rooms with filter: {@Filter}", filter);
                throw;
            }
        }

        public Task<RoomDto?> GetByIdAsync(int id)
        {
           try
            {
                _logger.LogInformation("Fetching room with ID: {RoomId}", id);
                var room =  _unitOfWork.Rooms.GetAllQueryable()
                    .Include(r => r.RoomType)
                    .FirstOrDefault(r => r.Id == id);
                if (room == null)
                {
                    _logger.LogWarning("Room with ID: {RoomId} not found", id);
                    return Task.FromResult<RoomDto?>(null);
                }
                var roomDto = _mapper.Map<RoomDto>(room);
                return Task.FromResult<RoomDto?>(roomDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching room with ID: {RoomId}", id);
                throw;
            }
        }

        public async Task<RoomDto> CreateAsync(CreateRoomDto createRoomDto)
        {
            try
            {
                _logger.LogInformation("Creating new room with data: {@CreateRoomDto}", createRoomDto);
                //Check if room number already exists
                var existingRoom = _unitOfWork.Rooms.GetAllQueryable()
                    .FirstOrDefault(r => r.RoomNumber == createRoomDto.RoomNumber); 
                if (existingRoom != null)                {
                    _logger.LogWarning("Room with number: {RoomNumber} already exists", createRoomDto.RoomNumber);
                    throw new InvalidOperationException($"Room with number {createRoomDto.RoomNumber} already exists        ");
                }
                
                var room = _mapper.Map<Core.Entities.Room>(createRoomDto);
                await _unitOfWork.Rooms.AddAsync(room);
                await _unitOfWork.SaveChangesAsync();
                _logger.LogInformation("Room created successfully with ID: {RoomId}", room.Id);
                var roomDto = _mapper.Map<RoomDto>(room);
                return roomDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating room with data: {@CreateRoomDto}", createRoomDto);
                throw;
            }
        }

        public async Task<RoomDto?> UpdateAsync(UpdateRoomDto updateRoomDto)
        {
            try
            {
                _logger.LogInformation("Updating room with ID: {RoomId} using data: {@UpdateRoomDto}", updateRoomDto.Id, updateRoomDto);
                var room = await _unitOfWork.Rooms.GetByIdAsync(updateRoomDto.Id);
                if (room == null)
                {
                    _logger.LogWarning("Room with ID: {RoomId} not found for update", updateRoomDto.Id);
                    return null;
                }
                //Check if new room number already exists for another room
                var existingRoom = _unitOfWork.Rooms.GetAllQueryable()
                    .FirstOrDefault(r => r.RoomNumber == updateRoomDto.RoomNumber && r.Id != updateRoomDto.Id); 
                if (existingRoom != null)                {
                    _logger.LogWarning("Another room with number: {RoomNumber} already exists", updateRoomDto.RoomNumber);
                    throw new InvalidOperationException($"Another room with number {updateRoomDto.RoomNumber} already exists        ");
                }
                
                _mapper.Map(updateRoomDto, room);
                _unitOfWork.Rooms.Update(room);
                await _unitOfWork.SaveChangesAsync();
                _logger.LogInformation("Room with ID: {RoomId} updated successfully", room.Id);
                var roomDto = _mapper.Map<RoomDto>(room);
                return roomDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating room with ID: {RoomId} using data: {@UpdateRoomDto}", updateRoomDto.Id, updateRoomDto);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
           try
            {
                _logger.LogInformation("Deleting room with ID: {RoomId}", id);
                var room = await _unitOfWork.Rooms.GetByIdAsync(id);
                if (room == null)
                {
                    _logger.LogWarning("Room with ID: {RoomId} not found for deletion", id);
                    return false;
                }
                _unitOfWork.Rooms.Delete(room);
                await _unitOfWork.SaveChangesAsync();
                _logger.LogInformation("Room with ID: {RoomId} deleted successfully", id);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting room with ID: {RoomId}", id);
                throw;
            }
        }

        public Task<IEnumerable<RoomDto>> GetAvailableRoomsAsync(DateTime checkIn, DateTime checkOut)
        {
            try
            {
                _logger.LogInformation("Fetching available rooms for check-in: {CheckIn} and check-out: {CheckOut}", checkIn, checkOut);
                   //Get  all roo,s with avaliable or cleaning status and not booked for the given date range
                 var availableRooms = _unitOfWork.Rooms.GetAllQueryable()
                .Include(r => r.Reservations)
                .Where(r => (r.Status == RoomStatus.Available || r.Status == RoomStatus.Cleaning) &&
                            !r.Reservations.Any(res =>
                                res.Status != ReservationStatus.Cancelled &&
                                ((checkIn >= res.CheckInDate && checkIn < res.CheckOutDate) ||
                                 (checkOut > res.CheckInDate && checkOut <= res.CheckOutDate) ||
                                 (checkIn <= res.CheckInDate && checkOut >= res.CheckOutDate))))
                .ToList();  
            return Task.FromResult(availableRooms.Select(r => _mapper.Map<RoomDto>(r)));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching available rooms for check-in: {CheckIn} and check-out: {CheckOut}", checkIn, checkOut);
                throw;
            }
        }
        
        public Task<bool> UpdateRoomStatusAsync(int roomId, RoomStatus newStatus)
        {
            try
            {
                _logger.LogInformation("Updating status of room with ID: {RoomId} to new status: {NewStatus}", roomId, newStatus);
                var room =  _unitOfWork.Rooms.GetByIdAsync(roomId).Result;
                if (room == null)
                {
                    _logger.LogWarning("Room with ID: {RoomId} not found for status update", roomId);
                    return Task.FromResult(false);
                }
                room.Status = newStatus;
                _unitOfWork.Rooms.Update(room);
                _unitOfWork.SaveChangesAsync().Wait();
                _logger.LogInformation("Status of room with ID: {RoomId} updated successfully to {NewStatus}", roomId, newStatus);
                return Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating status of room with ID: {RoomId} to new status: {NewStatus}", roomId, newStatus);
                throw;
        }
        }

    }
}