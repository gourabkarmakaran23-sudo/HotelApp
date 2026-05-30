using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class Booking : BaseEntity
    {
        public string BookingNumber { get; set; } = string.Empty;

        public int GuestId { get; set; }

        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        public decimal TotalAmount { get; set; }

        public BookingStatus Status { get; set; }

        public string? BookingType { get; set; }

        public string? BookingReference { get; set; }

        public string? SoldBy { get; set; }

        public string? ArrivalFrom { get; set; }

        public string? CustomerProfile { get; set; }

        public string? PurposeOfVisit { get; set; }

        public string? Remarks { get; set; }

        public Guest? Guest { get; set; }

        public ICollection<ReservationRoom> ReservationRooms { get; set; }
            = new List<ReservationRoom>();

        public ICollection<Invoice> Invoices { get; set; }
            = new List<Invoice>();
    }

    // public class BookingStatus
    // {
    // }
}