namespace HotelRestaurant.Core.Entities
{
    public class Reservation : BaseEntity
    {
        public int GuestId { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public ReservationStatus Status { get; set; } = ReservationStatus.Pending;
        public int Adults { get; set; }
        public int Children { get; set; }
        public decimal TotalAmount { get; set; }
        public string Notes { get; set; } = string.Empty;

        public Guest? Guest { get; set; }
        public Room? Room { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public Invoice? Invoice { get; set; }
    }
}
