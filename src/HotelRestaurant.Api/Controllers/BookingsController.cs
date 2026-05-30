using Microsoft.AspNetCore.Mvc;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Core.Interfaces;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Application.DTOs.Reservation;

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
                    Status = BookingStatus.Confirmed,
                    BookingType = dto.BookingType,
                    BookingReference = dto.BookingReference,
                    SoldBy = dto.SoldBy,
                    ArrivalFrom = dto.ArrivalFrom ?? "",
                    CustomerProfile = dto.CustomerProfile ?? "",
                    PurposeOfVisit = dto.PurposeOfVisit ?? "",
                    Remarks = dto.Remarks ?? ""
                };

                await _unitOfWork.Bookings.AddAsync(booking);
                await _unitOfWork.SaveChangesAsync();


                // =========================
                // CREATE RESERVATION ROOM
                // =========================
                var roomsList = await _unitOfWork.Rooms.GetAllAsync();
                foreach (var roomDto in dto.Rooms)
                {
                    var room = roomsList.FirstOrDefault(r =>
                        r.RoomNumber.Trim() ==
                        roomDto.RoomNo.Trim());

                    if (room == null)
                        continue;

                    // CHECK ROOM ALREADY BOOKED

                    var alreadyBooked = await _unitOfWork.ReservationRooms
                        .GetAllQueryable()
                        .AnyAsync(x =>

                            x.RoomId == room.Id

                            && dto.CheckIn < x.CheckOutDate

                            && dto.CheckOut > x.CheckInDate

                            && x.Status != BookingStatus.Cancelled
                        );

                    if (alreadyBooked)
                    {
                        return BadRequest(new
                        {
                            message =
                                $"Room {room.RoomNumber} is already booked for selected dates."
                        });
                    }

                    var notesSummary =
                        $"Plan: {roomDto.MealPlan}";

                    var reservationRoom =
                        new ReservationRoom
                        {
                            BookingId = booking.Id,

                            RoomId = room.Id,

                            CheckInDate = dto.CheckIn,

                            CheckOutDate = dto.CheckOut,

                            Adults = roomDto.Adults,

                            Children = roomDto.Children,

                            RoomAmount = roomDto.TotalAmount,

                            Status = BookingStatus.Pending,

                            Notes = notesSummary,

                            Pax =
                                (roomDto.Adults + roomDto.Children)
                                .ToString()
                        };

                    await _unitOfWork.ReservationRooms
                        .AddAsync(reservationRoom);

                    room.Status = RoomStatus.Reserved;
                }

                await _unitOfWork.SaveChangesAsync();
                // =========================
                // CREATE INVOICE
                // =========================

                var invoice = new Invoice
                {
                    BookingId = booking.Id,

                    InvoiceDate = DateTime.UtcNow,

                    Subtotal = dto.TotalAmount,

                    Tax = dto.TotalAmount * 0.05m,

                    Total = dto.TotalAmount * 1.05m,

                    PaidAmount = dto.AdvanceAmount,

                    DueAmount =
                        (dto.TotalAmount * 1.05m) - dto.AdvanceAmount,

                    PaymentStatus =
                        dto.AdvanceAmount >= dto.TotalAmount
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
        #region GetBookingById

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var result =
                await _reservationService
                    .GetBookingForEditAsync(id);

            if (result == null)
                return NotFound("Booking not found.");

            return Ok(result);
        }

        #endregion
    }
}