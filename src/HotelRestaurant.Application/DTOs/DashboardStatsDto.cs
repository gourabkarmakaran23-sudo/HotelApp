using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalBookings { get; set; }

        public int CompletedBookings { get; set; }

        public int CancelledBookings { get; set; }

        public int PendingBookings { get; set; }

        public decimal TotalRevenue { get; set; }

        public int TotalRooms { get; set; }

        public int OccupiedRooms { get; set; }

        public int AvailableRooms { get; set; }
    }
}