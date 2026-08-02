using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Api.Models;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

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
        [Authorize]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var hotelIdHeader = Request.Headers["X-Hotel-Id"].FirstOrDefault();
                var isSuperAdmin = User.IsInRole("SuperAdmin");
                var selectedHotelId = int.TryParse(hotelIdHeader, out var parsedHotelId) ? parsedHotelId : (int?)null;

                var bookingsQuery = _unitOfWork.Bookings
                    .GetAllQueryable()
                    .Include(b => b.ReservationRooms)
                    .Include(b => b.Invoices)
                    .AsQueryable();

                var roomsQuery = _unitOfWork.Rooms
                    .GetAllQueryable()
                    .AsQueryable();

                if (!isSuperAdmin && selectedHotelId.HasValue)
                {
                    bookingsQuery = bookingsQuery.Where(b => b.HotelId == selectedHotelId.Value);
                    roomsQuery = roomsQuery.Where(r => r.HotelId == selectedHotelId.Value);
                }
                else if (!isSuperAdmin)
                {
                    var userHotelIdClaim = User.FindFirst("hotel_id")?.Value;
                    if (int.TryParse(userHotelIdClaim, out var userHotelId))
                    {
                        bookingsQuery = bookingsQuery.Where(b => b.HotelId == userHotelId);
                        roomsQuery = roomsQuery.Where(r => r.HotelId == userHotelId);
                    }
                }

                var bookings = await bookingsQuery.ToListAsync();
                var rooms = await roomsQuery.ToListAsync();

                var totalBookings = bookings.Count;
                var completedBookings = bookings.Count(b => b.Status == BookingStatus.Completed);
                var cancelledBookings = bookings.Count(b => b.Status == BookingStatus.Cancelled);
                var pendingBookings = bookings.Count(b => b.Status == BookingStatus.Pending);
                var totalRevenue = bookings.Sum(b => b.TotalAmount);
                var occupiedRooms = bookings.SelectMany(b => b.ReservationRooms).Count(rr => rr.Status == BookingStatus.CheckedIn);
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

        [HttpGet("room-type-history")]
        [Authorize]
        public async Task<IActionResult> GetRoomTypeHistory(DateTime fromDate, DateTime toDate)
        {
            try
            {
                var hotelIdHeader = Request.Headers["X-Hotel-Id"].FirstOrDefault();
                var isSuperAdmin = User.IsInRole("SuperAdmin");
                var selectedHotelId = int.TryParse(hotelIdHeader, out var parsedHotelId) ? parsedHotelId : (int?)null;

                var roomTypes = await _unitOfWork.RoomTypes.GetAllAsync();
                var roomsQuery = _unitOfWork.Rooms.GetAllQueryable()
                    .Include(r => r.RoomTypes)
                    .AsQueryable();

                var reservationRoomsQuery = _unitOfWork.ReservationRooms.GetAllQueryable()
                    .Include(rr => rr.Room)
                        .ThenInclude(r => r!.RoomTypes)
                    .Where(rr => rr.CheckInDate < toDate && rr.CheckOutDate > fromDate && rr.Status != BookingStatus.Cancelled)
                    .AsQueryable();

                if (!isSuperAdmin && selectedHotelId.HasValue)
                {
                    roomsQuery = roomsQuery.Where(r => r.HotelId == selectedHotelId.Value);
                    reservationRoomsQuery = reservationRoomsQuery.Where(rr => rr.HotelId == selectedHotelId.Value);
                }
                else if (!isSuperAdmin)
                {
                    var userHotelIdClaim = User.FindFirst("hotel_id")?.Value;
                    if (int.TryParse(userHotelIdClaim, out var userHotelId))
                    {
                        roomsQuery = roomsQuery.Where(r => r.HotelId == userHotelId);
                        reservationRoomsQuery = reservationRoomsQuery.Where(rr => rr.HotelId == userHotelId);
                    }
                }

                var rooms = await roomsQuery.ToListAsync();
                var reservationRooms = await reservationRoomsQuery.ToListAsync();

                var totalRoomsByType = rooms
                    .GroupBy(r => r.RoomTypesId)
                    .ToDictionary(g => g.Key, g => g.Count());

                var dates = GenerateDateRange(fromDate, toDate);
                var rows = roomTypes.Select(rt =>
                {
                    var values = new Dictionary<string, string>();
                    foreach (var date in dates)
                    {
                        var currentDate = DateTime.ParseExact(date, "dd-MM-yyyy", null);
                        var bookedCount = reservationRooms.Count(rr =>
                            rr.Room?.RoomTypesId == rt.Id &&
                            rr.CheckInDate.Date <= currentDate &&
                            rr.CheckOutDate.Date > currentDate);

                        var total = totalRoomsByType.TryGetValue(rt.Id, out var count) ? count : 0;
                        values[date] = $"{bookedCount}/{total}";
                    }

                    return new RoomTypeHistoryRow(rt.Name, values);
                }).ToList();

                var response = new RoomTypeHistoryResponse(dates, rows);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        private static List<string> GenerateDateRange(DateTime fromDate, DateTime toDate)
        {
            var dates = new List<string>();
            var current = fromDate.Date;
            while (current <= toDate.Date)
            {
                dates.Add(current.ToString("dd-MM-yyyy"));
                current = current.AddDays(1);
            }
            return dates;
        }
    }
}