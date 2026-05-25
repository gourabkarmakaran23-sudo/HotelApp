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
        : GenericRepository<Reservation>, IBookingRepository
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
            return await _context.Reservations.AnyAsync(x =>

                x.RoomId == roomId

                && (!bookingId.HasValue || x.Id != bookingId.Value)

                // Date overlap logic
                && checkIn < x.CheckOutDate
                && checkOut > x.CheckInDate
            );
        }
    }
}