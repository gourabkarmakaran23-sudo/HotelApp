using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hotel.Application.DTOs.Reservation
{
    public class CheckInListDto
    {
        public int ReservationId { get; set; }

        public string BookingNumber { get; set; } = string.Empty;

        public string CustomerName { get; set; } = string.Empty;

        public string GuestName { get; set; } = string.Empty;

        public string RoomNo { get; set; } = string.Empty;

        public string RoomType { get; set; } = string.Empty;

        public decimal PaidAmount { get; set; }

        public decimal DueAmount { get; set; }

        public DateTime CheckInDate { get; set; }

        public DateTime CheckOutDate { get; set; }

        public string BookingStatus { get; set; } = string.Empty;

        public string MealPlan { get; set; } = string.Empty;

        public string Mobile { get; set; } = string.Empty;
        public string Pax { get; set; } = string.Empty;
    }
}