using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Core.Entities
{
   public class BedType:BaseEntity,IMultiHotelEntity
    {
         public int HotelId { get; set; } // Tracks which hotel owns this booking transaction
        public Hotel ?Hotel { get; set; }
        public string BedName { get; set; } = string.Empty; // e.g., King Size, Queen Size, Twin Bed
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}