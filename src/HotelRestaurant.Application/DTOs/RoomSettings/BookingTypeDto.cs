using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.RoomSettings
{
    public class BookingTypeDto
    {
        public int Id { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public string? Remarks { get; set; }
        public bool IsActive { get; set; } = true;
    }
}