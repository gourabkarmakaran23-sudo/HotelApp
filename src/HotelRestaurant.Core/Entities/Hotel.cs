namespace HotelRestaurant.Core.Entities
{
    public class Hotel : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public decimal Rating { get; set; }

        public ICollection<Room> Rooms { get; set; } = new List<Room>();
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}
