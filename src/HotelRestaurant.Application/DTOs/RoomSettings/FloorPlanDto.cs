using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.RoomSettings
{
   public class FloorPlanDto
    {
        public int Id { get; set; }
        public string FloorName { get; set; } = string.Empty;
        public string? Remarks { get; set; }
        public bool IsActive { get; set; } = true;
    }
}