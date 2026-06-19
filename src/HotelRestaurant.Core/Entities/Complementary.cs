using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class Complementary:BaseEntity
    {
        public string ItemName { get; set; } = string.Empty; // e.g., Welcome Drink, Free High-Speed Wi-Fi, Buffet Breakfast
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}