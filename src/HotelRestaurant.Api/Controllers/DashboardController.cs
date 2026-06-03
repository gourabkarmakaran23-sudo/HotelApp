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
                var reservations = await _unitOfWork.Reservations
                    .GetAllQueryable()
                    .Include(r => r.Room)
                    .Include(r => r.Invoice)
                    .ToListAsync();

                var rooms = await _unitOfWork.Rooms
                    .GetAllAsync();

                var totalBookings = reservations.Count;

                var completedBookings = reservations.Count(r =>
                    r.Status.ToString().ToLower() == "completed");

                var cancelledBookings = reservations.Count(r =>
                    r.Status.ToString().ToLower() == "cancelled");

                var pendingBookings = reservations.Count(r =>
                    r.Status.ToString().ToLower() == "pending");

                var totalRevenue = reservations.Sum(r => r.TotalAmount);

                var occupiedRooms = reservations.Count(r =>
                    r.Status.ToString().ToLower() == "checkedin");

                var totalRooms = rooms.Count();

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