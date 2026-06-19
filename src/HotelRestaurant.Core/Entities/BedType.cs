using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
   public class BedType:BaseEntity
    {

        public string BedName { get; set; } = string.Empty; // e.g., King Size, Queen Size, Twin Bed
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}