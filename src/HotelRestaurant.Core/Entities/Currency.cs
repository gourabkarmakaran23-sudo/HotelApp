using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class Currency : BaseEntity
    {
        public string CurrencyName { get; set; } = "";
        public string CurrencyIcon { get; set; } = "";
        public string Position { get; set; } = "Left";
        public decimal ConversionRate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}