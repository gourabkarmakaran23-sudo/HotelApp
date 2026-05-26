using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelRestaurant.Infrastructure.Repositories
{
    public class BookingRepository
        : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(AppDbContext context)
            : base(context)
        {
        }
        public async Task<bool> IsRoomBookedAsync(
            int roomId,
            DateTime checkIn,
            DateTime checkOut,
            int? bookingId = null)
        {
            return await _context.ReservationRooms.AnyAsync(x =>

                x.RoomId == roomId

                // Ignore same booking during edit
                && (!bookingId.HasValue || x.BookingId != bookingId.Value)

                // DATE OVERLAP CHECK
                && checkIn < x.CheckOutDate

                && checkOut > x.CheckInDate

                // Optional:
                && x.Status != ReservationStatus.Cancelled
            );
        }

    }
}