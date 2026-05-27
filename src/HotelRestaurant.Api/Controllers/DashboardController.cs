using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelRestaurant.API.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var bookings = await _unitOfWork.Bookings
                    .GetAllQueryable()
                    .Include(b => b.ReservationRooms)
                    .Include(b => b.Invoices)
                    .ToListAsync();

                var rooms = await _unitOfWork.Rooms
                    .GetAllAsync();

                // TOTAL BOOKINGS
                var totalBookings = bookings.Count;

                // STATUS COUNTS
                var completedBookings = bookings.Count(b =>
                    b.Status == BookingStatus.Completed);

                var cancelledBookings = bookings.Count(b =>
                    b.Status == BookingStatus.Cancelled);

                var pendingBookings = bookings.Count(b =>
                    b.Status == BookingStatus.Pending);

                // TOTAL REVENUE
                var totalRevenue = bookings.Sum(b =>
                    b.TotalAmount);

                // OCCUPIED ROOMS
                var occupiedRooms = bookings
                    .SelectMany(b => b.ReservationRooms)
                    .Count(rr =>
                        rr.Status == BookingStatus.CheckedIn);

                // TOTAL ROOMS
                var totalRooms = rooms.Count();

                // AVAILABLE ROOMS
                var availableRooms = totalRooms - occupiedRooms;

                var stats = new DashboardStatsDto
                {
                    TotalBookings = totalBookings,

                    CompletedBookings = completedBookings,

                    CancelledBookings = cancelledBookings,

                    PendingBookings = pendingBookings,

                    TotalRevenue = totalRevenue,

                    TotalRooms = totalRooms,

                    OccupiedRooms = occupiedRooms,

                    AvailableRooms = availableRooms
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


    }
}