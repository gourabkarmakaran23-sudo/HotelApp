using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.Reservation
{
    public class BookingGuestUpdateDto
    {
        // CRITICAL FIX: Add this property to track the primary key ID from the database
        public int? Id { get; set; }
        public string RoomNo { get; set; } = string.Empty;
        public string Title { get; set; } = "Mr.";
        public string GuestFirstName { get; set; } = string.Empty;
        public string GuestLastName { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string Gender { get; set; } = "Male";
        public int? Age { get; set; }
        public string IdType { get; set; } = "Aadhar Card";
        public string IdNumber { get; set; } = string.Empty;
    }
}