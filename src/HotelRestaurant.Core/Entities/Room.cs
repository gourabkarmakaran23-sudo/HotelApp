namespace HotelRestaurant.Core.Entities
{
    public class Room : BaseEntity
    {
        public int HotelId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public RoomType RoomType { get; set; }
        public int Capacity { get; set; }
        public decimal Price { get; set; }
        public RoomStatus Status { get; set; } = RoomStatus.Available;
        public string Description { get; set; } = string.Empty;

        public Hotel? Hotel { get; set; }
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
