namespace HotelRestaurant.Core.Entities
{
    public class Order : BaseEntity
    {
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
        public int? ReservationId { get; set; }
        public int? GuestId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        public decimal TotalAmount { get; set; }

        // Navigation Properties matching the expanded Reservation architecture
        public Reservation? Reservation { get; set; }
        public Guest? Guest { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public Invoice? Invoice { get; set; }
    }
}
