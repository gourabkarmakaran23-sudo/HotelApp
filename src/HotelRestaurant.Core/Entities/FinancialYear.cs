using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Core.Entities
{
    public class FinancialYear : BaseEntity,IMultiHotelEntity
    {
        public int HotelId { get; set; } // Essential for tracing specific hotel outlays
        public Hotel Hotel { get; set; }
        public string Title { get; set; } = "";

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsActive { get; set; }
    }
}