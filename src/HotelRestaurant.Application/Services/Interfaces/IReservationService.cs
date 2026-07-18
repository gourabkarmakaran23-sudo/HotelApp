using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hotel.Application.DTOs.Reservation;
using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Application.DTOs.Reservation;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IReservationService
    {
        Task<BookingResultDto> CreateBookingAsync(CreateBookingDto dto);
        Task<bool> UpdateBookingOccupantsAsync(int bookingId, List<BookingGuestUpdateDto> guestDtos);
        Task<List<CheckInListDto>> GetCheckInListAsync(string? searchTerm = null);
        Task<List<UpcomingCheckInDto>> GetUpcomingCheckInsAsync();
        Task<bool> CheckInBookingAsync(int bookingId);
        Task<bool> CheckOutBookingAsync(int bookingId, string paymentMode, decimal subtotal, decimal additionalCharges, decimal adjustmentAmount);

        Task<BookingEditDto?> GetBookingForEditAsync(int bookingId);
        //Task<BookingEditDto?> GetBookingForEditAsync(int bookingId);
        Task<object?> GetBookingByIdAsync(int bookingId);

        // Task<bool> CheckInBookingAsync(int bookingId);
    }
}