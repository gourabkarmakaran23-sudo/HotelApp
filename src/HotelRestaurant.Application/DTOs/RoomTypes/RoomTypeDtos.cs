using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.RoomTypes
{
    public class RoomTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }

        public int MaxOccupancy { get; set; }

        public int MaxAdults { get; set; }
        public int MaxChildren { get; set; }
        public string Amenities { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }


    }
    public class CreateRoomTypeDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }

        public int MaxOccupancy { get; set; }

        public int MaxAdults { get; set; }
        public int MaxChildren { get; set; }
        public string Amenities { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class UpdateRoomTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }

        public int MaxOccupancy { get; set; }

        public int MaxAdults { get; set; }
        public int MaxChildren { get; set; }
        public string Amenities { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}