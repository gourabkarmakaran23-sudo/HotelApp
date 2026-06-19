using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs
{
    public class RoomBookingDto
    {
        public int RoomTypeId { get; set; }

        public string RoomNo { get; set; } = string.Empty;

        public string MealPlan { get; set; } = string.Empty;

        public int ExtraChildAge { get; set; }

        public int Adults { get; set; }

        public int Children { get; set; }

        public decimal RentPerNight { get; set; }

        public decimal ComplimentaryPerNight { get; set; }

        public decimal ExtraCharge { get; set; }

        public decimal TotalAmount { get; set; }
    }
}