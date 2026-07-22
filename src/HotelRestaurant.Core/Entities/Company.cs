namespace HotelRestaurant.Core.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LegalRegistrationNumber { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Collections
        public ICollection<Hotel> Hotels { get; set; } = new List<Hotel>();
    }
}