using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class BookingType:BaseEntity
    {
        public string TypeName { get; set; } = string.Empty; // e.g., Room Booking, Event Booking, Table Booking
        public string? Remarks { get; set; }
        public bool IsActive { get; set; } = true;
    }
}