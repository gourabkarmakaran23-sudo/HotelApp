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

                && x.Status != BookingStatus.Cancelled
                && HasConflict(checkIn, checkOut, x.CheckInDate, x.CheckOutDate)
            );
        }

        private static bool HasConflict(DateTime proposedCheckIn, DateTime proposedCheckOut, DateTime existingCheckIn, DateTime existingCheckOut)
        {
            if (proposedCheckOut <= existingCheckIn || proposedCheckIn >= existingCheckOut)
            {
                return false;
            }

            var sameDayShortStay = proposedCheckIn.Date == proposedCheckOut.Date
                && existingCheckIn.Date == existingCheckOut.Date
                && proposedCheckIn.Date == existingCheckIn.Date
                && (proposedCheckOut - proposedCheckIn) <= TimeSpan.FromHours(2)
                && (existingCheckOut - existingCheckIn) <= TimeSpan.FromHours(2);

            return !sameDayShortStay;
        }

    }
}