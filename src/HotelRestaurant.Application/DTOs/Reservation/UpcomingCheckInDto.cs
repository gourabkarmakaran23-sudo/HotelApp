using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.Reservation
{

    public class UpcomingCheckInDto
    {
        public int BookingId { get; set; }

        public string BookingNumber { get; set; } = string.Empty;

        public string GuestName { get; set; } = string.Empty;

        public string Mobile { get; set; } = string.Empty;

        public string RoomNumbers { get; set; } = string.Empty;

        public string RoomTypes { get; set; } = string.Empty;

        public DateTime CheckInDate { get; set; }

        public DateTime CheckOutDate { get; set; }

        public decimal TotalAmount { get; set; }

        public string BookingStatus { get; set; } = string.Empty;
    }

}