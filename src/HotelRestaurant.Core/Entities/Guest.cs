using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Core.Entities
{

public class Guest : BaseEntity,IMultiHotelEntity
    {
        public int HotelId { get; set; } // Essential for tracing specific hotel outlays
        public Hotel Hotel { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string NationalId { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        public string Nationality { get; set; } = "Indian";

         public ICollection<Booking> Bookings { get; set; }
        = new List<Booking>();

        //public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }

}
