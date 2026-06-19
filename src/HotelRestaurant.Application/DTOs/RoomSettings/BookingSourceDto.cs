using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.RoomSettings
{
    public class BookingSourceDto
    {
        public int Id { get; set; }
        public string SourceName { get; set; } = string.Empty;
        public string? Details { get; set; }
        public bool IsActive { get; set; } = true;
    }
}