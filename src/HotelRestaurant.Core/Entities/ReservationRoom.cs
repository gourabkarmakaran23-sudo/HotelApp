using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class ReservationRoom : BaseEntity
    {
        public int BookingId { get; set; }

        public int RoomId { get; set; }

        public DateTime CheckInDate { get; set; }

        public DateTime CheckOutDate { get; set; }

        public int Adults { get; set; }

        public int Children { get; set; }

        public decimal RoomAmount { get; set; }

        public BookingStatus Status { get; set; }

        public string Notes { get; set; } = string.Empty;
        public string Pax { get; set; } = string.Empty;


        public string MealPlan { get; set; } = string.Empty;

        public Booking? Booking { get; set; }

        public Room? Room { get; set; }
    }
}