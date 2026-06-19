using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Core.Interfaces
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<bool> IsRoomBookedAsync(
    int roomId,
    DateTime checkIn,
    DateTime checkOut,
    int? bookingId = null
);
    }
}