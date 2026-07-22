using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Interfaces;
namespace HotelRestaurant.Core.Entities
{
    public class WakeUpCall : BaseEntity,IMultiHotelEntity
    {
        public int HotelId { get; set; } // Essential for tracing specific hotel outlays
        public Hotel Hotel { get; set; }
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