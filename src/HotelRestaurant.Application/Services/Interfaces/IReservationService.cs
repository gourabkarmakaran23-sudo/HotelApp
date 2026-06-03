using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hotel.Application.DTOs.Reservation;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IReservationService
    {
        Task<List<CheckInListDto>> GetCheckInListAsync();
    }
}