using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class FinancialYear : BaseEntity
    {
        public string Title { get; set; } = "";

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsActive { get; set; }
    }
}