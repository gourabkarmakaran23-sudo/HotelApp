using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class BookingSource:BaseEntity
    {
        public string SourceName { get; set; } = string.Empty; // e.g., Walk-In, Website, Booking.com, Expedia
        public string? Details { get; set; }
        public bool IsActive { get; set; } = true;
    }
}