using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class CommissionAgent : BaseEntity
    {
        public string AgentName { get; set; } = "";

        public string? Address { get; set; }

        public string? Mobile { get; set; }

        public string? Email { get; set; }

        public string? GSTIN { get; set; }

        public bool IsActive { get; set; } = true;
    }
}