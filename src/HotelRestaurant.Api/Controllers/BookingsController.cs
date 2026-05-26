using Microsoft.AspNetCore.Mvc;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Core.Interfaces;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using HotelRestaurant.Application.Services.Interfaces;

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
        public async Task<IActionResult> GetCheckInList()
        {
            var data = await _reservationService.GetCheckInListAsync();

            return Ok(data);
        }
        #endregion        
        #region CreateBooking
        // LEAVE ROUTE BALK BLANK SO IT PINPOINTS ABSOLUTE BASE URL ROUTE ("api/bookings")
        [HttpPost("")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            if (dto == null)
                return BadRequest("Payload data cannot be empty.");

            try
            {
                // Validate string fields to protect against database NOT NULL column constraints
                string validatedFirstName = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingFirstName : dto.PrimaryFirstName) ? "WalkIn" : (dto.SameAsCustomer ? dto.BillingFirstName : dto.PrimaryFirstName);
                string validatedLastName = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingLastName : dto.PrimaryLastName) ? "Guest" : (dto.SameAsCustomer ? dto.BillingLastName : dto.PrimaryLastName);
                string validatedPhone = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingMobile : dto.PrimaryMobile) ? "0000000000" : (dto.SameAsCustomer ? dto.BillingMobile : dto.PrimaryMobile);

                // 1. Create the Guest Entity
                var guest = new Guest
                {
                    FirstName = validatedFirstName,
                    LastName = validatedLastName,
                    Phone = validatedPhone,
                    Email = string.IsNullOrWhiteSpace(dto.Email) ? "no-email@hotel.com" : dto.Email,
                    Address = string.IsNullOrWhiteSpace(dto.BillingAddress) ? "Not Provided" : dto.BillingAddress,
                    NationalId = "PENDING_ID_SCAN",
                    DateOfBirth = new DateTime(1990, 1, 1)
                };

                await _unitOfWork.Guests.AddAsync(guest);
                await _unitOfWork.SaveChangesAsync();


                // =========================
                // CREATE BOOKING MASTER
                // =========================

                var bookingNumber =
                    $"RES-{DateTime.Now:yyyyMMddHHmmss}";

                var booking = new Booking
                {
                    BookingNumber = bookingNumber,
                    GuestId = guest.Id,
                    BookingDate = DateTime.UtcNow,
                    TotalAmount = dto.TotalAmount,
                    Status = BookingStatus.Confirmed
                };

                await _unitOfWork.Bookings.AddAsync(booking);

                var room =
            await _unitOfWork.Rooms
            .GetAllQueryable()
            .FirstOrDefaultAsync(x =>
                x.RoomNumber == dto.RoomNo);

                if (room == null)
                {
                    return BadRequest("Room not found");
                }

                // =========================
                // CHECK ROOM ALREADY BOOKED
                // =========================

                var alreadyBooked =
                    await _unitOfWork.ReservationRooms
                    .GetAllQueryable()
                    .AnyAsync(x =>

                        x.RoomId == room.Id

                        && dto.CheckIn < x.CheckOutDate

                        && dto.CheckOut > x.CheckInDate

                        && x.Status != ReservationStatus.Cancelled
                    );

                if (alreadyBooked)
                {
                    return BadRequest(new
                    {
                        message =
                        "This room is already booked for the selected date range."
                    });
                }

                // =========================
                // CREATE RESERVATION ROOM
                // =========================

                var notesSummary =
                    $"Plan: {dto.MealPlan}";

                var reservationRoom =
                    new ReservationRoom
                    {
                        BookingId = booking.Id,

                        RoomId = room.Id,

                        CheckInDate = dto.CheckIn,

                        CheckOutDate = dto.CheckOut,

                        Adults = dto.Adults,

                        Children = dto.Children,

                        RoomAmount = dto.TotalAmount,

                        Status = ReservationStatus.Pending,

                        Notes = notesSummary,

                        Pax =
                            (dto.Adults + dto.Children).ToString()
                    };
                await _unitOfWork.ReservationRooms.AddAsync(reservationRoom);
                room.Status = RoomStatus.Reserved;

                await _unitOfWork.SaveChangesAsync();
                // =========================
                // CREATE INVOICE
                // =========================

                decimal tax =
                    dto.TotalAmount * 0.05m;

                decimal total =
                    dto.TotalAmount + tax;

                var invoice = new Invoice
                {
                    BookingId = booking.Id,

                    InvoiceDate = DateTime.UtcNow,

                    Subtotal = dto.TotalAmount,

                    Tax = tax,

                    Total = total,

                    PaidAmount = dto.AdvanceAmount,

                    DueAmount = total - dto.AdvanceAmount,

                    PaymentStatus =
                        dto.AdvanceAmount >= total
                        ? PaymentStatus.Paid
                        : dto.AdvanceAmount > 0
                            ? PaymentStatus.PartiallyPaid
                            : PaymentStatus.Unpaid
                };

                await _unitOfWork.Invoices.AddAsync(invoice);

                await _unitOfWork.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    bookingId = booking.Id,
                    bookingNumber = booking.BookingNumber,
                    guestId = guest.Id,
                    invoiceId = invoice.Id
                });


            }
            catch (Exception ex)
            {
                var internalMessage = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Internal Database Error: {internalMessage}");
            }
        }
        #endregion

        #region GetBookingById
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var reservations = await _unitOfWork.Reservations
                    .GetAllQueryable()
                    .Include(r => r.Guest)
                    .Include(r => r.Room)
                    .Include(r => r.Invoice)
                    .OrderByDescending(r => r.CreatedAt)
                    .ToListAsync();

                var result = reservations.Select(r => new
                {
                    id = r.Id,
                    bookingNumber = r.Notes != null && r.Notes.Contains("REF-")
                        ? r.Notes
                        : $"RES-{r.Id}",

                    bookingDate = r.CreatedAt.ToString("yyyy-MM-dd"),

                    // roomType = r.Room?.RoomType.ToString() ?? "Standard",
                    roomType = r.Room?.RoomTypesId.ToString() ?? "N/A",
                    roomNo = r.Room?.RoomNumber ?? "N/A",

                    mealPlan = "Room Only",

                    pax = r.Pax,

                    name = r.Guest != null
                        ? $"{r.Guest.FirstName} {r.Guest.LastName}"
                        : "Unknown Guest",

                    mobile = r.Guest?.Phone ?? string.Empty,

                    guestName = r.Guest != null
                        ? $"{r.Guest.FirstName} {r.Guest.LastName}"
                        : "Unknown Guest",

                    guestPhone = r.Guest?.Phone ?? string.Empty,

                    checkIn = r.CheckInDate.ToString("yyyy-MM-ddTHH:mm:ss"),

                    checkOut = r.CheckOutDate.ToString("yyyy-MM-ddTHH:mm:ss"),

                    paymentStatus = r.Invoice?.PaymentStatus.ToString() ?? "Unpaid",

                    amount = r.TotalAmount
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        #endregion
    }
}