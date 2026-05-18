namespace HotelRestaurant.Core.Entities
{
    public class Room : BaseEntity
    {
        // public int HotelId { get; set; }
        // public string RoomNumber { get; set; } = string.Empty;
        // public RoomType RoomType { get; set; }
        // public int Capacity { get; set; }
        // public decimal Price { get; set; }
        // public RoomStatus Status { get; set; } = RoomStatus.Available;
        // public string Description { get; set; } = string.Empty;

        // public Hotel? Hotel { get; set; }
        // public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

        //New

        public int HotelId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public RoomType RoomType { get; set; }
        public int Capacity { get; set; }
        public decimal Price { get; set; }
        public RoomStatus Status { get; set; } = RoomStatus.Available;
        public string Description { get; set; } = string.Empty;

        // Navigation relationships 
        public Hotel? Hotel { get; set; }
        
        // Maps backward securely to the updated Reservation model configuration
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
