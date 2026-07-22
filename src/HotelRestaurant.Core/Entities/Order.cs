using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Core.Entities
{
    public class Order : BaseEntity,IMultiHotelEntity
    {
        public int HotelId { get; set; } // Essential for tracing specific hotel outlays
        public Hotel Hotel { get; set; }
        // public int? ReservationId { get; set; }
        // public int? GuestId { get; set; }
        // public DateTime OrderDate { get; set; }
        // public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        // public decimal TotalAmount { get; set; }

        // public Reservation? Reservation { get; set; }
        // public Guest? Guest { get; set; }
        // public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        // public Invoice? Invoice { get; set; }

        //New
        public int? BookingId { get; set; }
        public int? GuestId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        public decimal TotalAmount { get; set; }

        // Navigation Properties matching the expanded Booking architecture
        public Booking? Booking { get; set; }
        public Guest? Guest { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public Invoice? Invoice { get; set; }
    }
}
