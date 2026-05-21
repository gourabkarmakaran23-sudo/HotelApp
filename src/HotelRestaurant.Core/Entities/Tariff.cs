using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class Tariff:BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public int RoomTypeId { get; set; }
        public decimal PricePerNight { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime EffectiveTo { get; set; }

        public DayOfWeek ApplicableDays { get; set; }

        public SeasonType SeasonType { get; set; }

        public bool IsActive { get; set; }

        public string Description { get; set; } = string.Empty;

        // Navigation property
        public RoomTypes RoomType { get; set; }=null!;


        
    }
}