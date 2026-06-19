using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class RoomTypeFacility
    {
        public int RoomTypeId { get; set; }

        public int RoomFacilityId { get; set; } 

        public bool IsIncluded { get; set; }    

        // Navigation properties
        public RoomTypes RoomType { get; set; } = null!;
        public RoomFacility RoomFacility { get; set; } = null!;
    }
}