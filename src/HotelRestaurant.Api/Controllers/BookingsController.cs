using Microsoft.AspNetCore.Mvc;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Core.Interfaces;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Application.DTOs.Reservation;
using HotelRestaurant.Application.DTOs.CheckOut;

namespace HotelRestaurant.Api.Controllers
{
    [ApiController]
    // HARDCODE THE ROUTE STRING DIRECTLY - DO NOT USE [controller] Token
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IReservationService _reservationService;

        public BookingsController(
            IUnitOfWork unitOfWork,
            IReservationService reservationService)
        {
            _unitOfWork = unitOfWork;
            _reservationService = reservationService;
        }

        #region GetCheckInList 
        [HttpGet("checkin-list")]
        public async Task<IActionResult> GetCheckInList([FromQuery] string? searchTerm)
        {
            var data = await _reservationService.GetCheckInListAsync(searchTerm);

            return Ok(data);
        }
        #endregion
        #region Create Reservation (Clean SOLID approach)
        [HttpPost("")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            try
            {
                var result = await _reservationService.CreateBookingAsync(dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Database Error processing stay: {ex.Message}");
            }
        }
        #endregion


        #region GetAllBookings

        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var bookings = await _unitOfWork.Bookings
                    .GetAllQueryable()

                    .Include(b => b.Guest)

                    .Include(b => b.ReservationRooms)
                        .ThenInclude(rr => rr.Room)
                            .ThenInclude(r => r.RoomTypes)

                    .Include(b => b.Invoices)

                    .OrderByDescending(b => b.CreatedAt)

                    .ToListAsync();

                var result = bookings.Select(b =>
                {
                    var firstRoom = b.ReservationRooms.FirstOrDefault();

                    var invoice = b.Invoices.FirstOrDefault();

                    return new
                    {
                        id = b.Id,

                        bookingNumber = b.BookingNumber,

                        bookingDate = b.BookingDate
                            .ToString("yyyy-MM-dd"),

                        roomType = string.Join(", ",
                        b.ReservationRooms
                         .Select(rr => rr.Room.RoomTypes.Name)),
                        //roomType = firstRoom?.Room?.RoomTypes?.Name ?? "N/A",

                        roomNo = string.Join(", ",
                            b.ReservationRooms
                                .Select(x => x.Room?.RoomNumber)
                                .Where(x => !string.IsNullOrEmpty(x))),

                        mealPlan = string.Join(", ",
                            b.ReservationRooms
                                .Select(x => x.MealPlan)
                                .Where(x => !string.IsNullOrEmpty(x))),

                        pax = string.Join(", ",
                            b.ReservationRooms
                                .Select(x => x.Pax)),

                        name = b.Guest != null
                            ? $"{b.Guest.FirstName} {b.Guest.LastName}"
                            : "Unknown Guest",

                        mobile = b.Guest?.Phone ?? string.Empty,

                        guestName = b.Guest != null
                            ? $"{b.Guest.FirstName} {b.Guest.LastName}"
                            : "Unknown Guest",

                        guestPhone = b.Guest?.Phone ?? string.Empty,

                        checkIn = firstRoom != null
                            ? firstRoom.CheckInDate
                                .ToString("yyyy-MM-ddTHH:mm:ss")
                            : "",

                        checkOut = firstRoom != null
                            ? firstRoom.CheckOutDate
                                .ToString("yyyy-MM-ddTHH:mm:ss")
                            : "",

                        paymentStatus = invoice != null
                            ? invoice.PaymentStatus.ToString()
                            : "Unpaid",

                        amount = b.TotalAmount,

                        bookingStatus = b.Status.ToString()
                    };
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    $"Internal Server Error: {ex.Message}");
            }
        }

        #endregion

        #region Upcoming CheckIns

        [HttpGet("upcoming-checkins")]
        public async Task<IActionResult> GetUpcomingCheckIns()
        {
            var result =
                await _reservationService
                    .GetUpcomingCheckInsAsync();

            return Ok(result);
        }

        #endregion

        #region Check In Booking
        [HttpPost("{id}/checkin")]
        public async Task<IActionResult> CheckInBooking(int id)
        {
            try
            {
                var success = await _reservationService.CheckInBookingAsync(id);

                if (!success)
                    return NotFound($"Booking with ID {id} was not found or cannot be checked in.");

                return Ok(new { success = true, message = "Booking checked in successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error while checking in booking: {ex.Message}");
            }
        }
        #endregion

        #region Check Out Booking
        [HttpPost("{id}/checkout")]
        public async Task<IActionResult> CheckOutBooking(int id, [FromBody] CheckOutBookingDto dto)
        {
            try
            {
                var success = await _reservationService.CheckOutBookingAsync(
                    id,
                    dto.PaymentMode,
                    dto.Subtotal,
                    dto.AdditionalCharges,
                    dto.AdjustmentAmount);

                if (!success)
                    return NotFound($"Booking with ID {id} was not found or cannot be checked out.");

                return Ok(new { success = true, message = "Booking checked out successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error while checking out booking: {ex.Message}");
            }
        }
        #endregion

        #region GetBookingById

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var result =
                await _reservationService
                    .GetBookingByIdAsync(id);

            if (result == null)
                return NotFound("Booking not found.");

            return Ok(result);
        }

        #endregion

        #region Update Specific Room Occupant Companions
        [HttpPut("{id}/occupants")]
        public async Task<IActionResult> UpdateBookingOccupants(int id, [FromBody] List<BookingGuestUpdateDto> guestDtos)
        {
            try
            {
                if (guestDtos == null || guestDtos.Count == 0)
                    return BadRequest("Occupants updates target dataset compilation collection cannot be left empty.");

                var success = await _reservationService.UpdateBookingOccupantsAsync(id, guestDtos);

                if (!success)
                    return NotFound($"Unable to process changes. Target stay identity index #{id} was not tracked inside our registers.");

                return Ok(new { success = true, message = "Occupants listing state collection updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Tracking exception matching records: {ex.Message}");
            }
        }
        #endregion

    }
}