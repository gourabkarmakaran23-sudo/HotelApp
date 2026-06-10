using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class FloorPlan:BaseEntity
    {
        public string FloorName { get; set; } = string.Empty; // e.g., Ground Floor, 1st Floor, Penthouse Level
        public string? Remarks { get; set; }
        public bool IsActive { get; set; } = true;
    }
}