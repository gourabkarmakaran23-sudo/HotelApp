using System;

namespace HotelRestaurant.Core.Entities
{
    public class Amenity
    {
        public int Id { get; set; }
        public string AmenityName { get; set; } = string.Empty; // e.g., Free Wi-Fi, Swimming Pool
        public string? IconClass { get; set; } // FontAwesome class names e.g., fa-wifi
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}