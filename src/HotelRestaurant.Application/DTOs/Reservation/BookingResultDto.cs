using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.Reservation
{
   public class BookingResultDto
    {
        public bool Success { get; set; }
        public int BookingId { get; set; }
        public string BookingNumber { get; set; } = string.Empty;
        public int GuestId { get; set; }
        public int InvoiceId { get; set; }
    }
}