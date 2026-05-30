using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hotel.Application.DTOs.Reservation;
using HotelRestaurant.Application.DTOs.Reservation;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IReservationService
    {
        Task<List<CheckInListDto>> GetCheckInListAsync();
        Task<List<UpcomingCheckInDto>> GetUpcomingCheckInsAsync();

   Task<BookingEditDto?> GetBookingForEditAsync(int bookingId);
     //Task<BookingEditDto?> GetBookingForEditAsync(int bookingId);
     Task<object?> GetBookingByIdAsync(int bookingId);

// Task<bool> CheckInBookingAsync(int bookingId);
    }
}