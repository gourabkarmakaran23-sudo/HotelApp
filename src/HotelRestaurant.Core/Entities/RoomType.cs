using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class RoomTypes:BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // public decimal PricePerNight { get; set; }
         public decimal BasePrice { get; set; }
        public int MaxOccupancy { get; set; }

        public int MaxAdults { get; set; }
        public int MaxChildren { get; set; }

        public string Amenities { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }

        // Navigation property
        public ICollection<Room> Rooms { get; set; } = new List<Room>();

        public ICollection<Tariff> Tariffs { get; set; } = new List<Tariff>();

        public ICollection<RoomTypeFacility> RoomTypeFacilities { get; set; } = new List<RoomTypeFacility>();

    }
}