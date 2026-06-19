using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class WakeUpCall : BaseEntity
    {
        public string RoomNumber { get; set; } = string.Empty;

        public string GuestName { get; set; } = string.Empty;

        public DateTime CallDateTime { get; set; }

        public string? Remarks { get; set; }

        /// <summary>
        /// Supported operational flags: "Pending", "Completed", "Cancelled"
        /// </summary>
        public string Status { get; set; } = "Pending";
        public bool IsActive { get; set; } = true;
    }

}