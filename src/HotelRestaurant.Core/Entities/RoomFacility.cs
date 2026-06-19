using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class RoomFacility:BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string IconUrl { get; set; } = string.Empty;

        public bool IsActive { get; set; }

        // Navigation property
        public ICollection<RoomTypeFacility> RoomTypeFacilities { get; set; } = new List<RoomTypeFacility>();
        
    }
}