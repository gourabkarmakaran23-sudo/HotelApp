using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Hotel.Application.DTOs.Reservation;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using HotelRestaurant.Application.DTOs.Reservation;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class ReservationService : IReservationService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        private readonly ILogger<ReservationService> _logger;

        public ReservationService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<ReservationService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }


        #region   CheckIn List N
        public async Task<List<CheckInListDto>>
            GetCheckInListAsync()
        {
            var bookings =
                await _unitOfWork.Bookings
                .GetAllQueryable()

                .Include(x => x.Guest)

                .Include(x => x.ReservationRooms)
                    .ThenInclude(r => r.Room)
                        .ThenInclude(rt => rt.RoomTypes)

                .Include(x => x.Invoices)

                .ToListAsync();

            return bookings.SelectMany(b =>
                b.ReservationRooms.Select(r => new CheckInListDto
                {
                    ReservationId = r.Id,

                    BookingNumber = b.BookingNumber,

                    CustomerName =
                        b.Guest.FirstName + " " +
                        b.Guest.LastName,

                    GuestName =
                        b.Guest.FirstName + " " +
                        b.Guest.LastName,

                    RoomNo =
                        r.Room.RoomNumber,

                    RoomType =
                        r.Room.RoomTypes.Name,

                    MealPlan =
                        ExtractMealPlan(r.Notes),

                    Pax =
                        r.Pax,

                    Mobile =
                        b.Guest.Phone,

                    PaidAmount =
                        b.Invoices.Sum(i => i.PaidAmount),

                    DueAmount =
                        b.Invoices.Sum(i => i.DueAmount),

                    CheckInDate =
                        r.CheckInDate,

                    CheckOutDate =
                        r.CheckOutDate,

                    BookingStatus =
                        r.Status.ToString()
                })
            ).ToList();
        }
        #endregion

        #region Extract Meal Plan
        private string ExtractMealPlan(string notes)
        {
            if (string.IsNullOrWhiteSpace(notes))
                return "";

            var planKey = "Plan:";

            var startIndex = notes.IndexOf(planKey);

            if (startIndex == -1)
                return "";

            startIndex += planKey.Length;

            var endIndex = notes.IndexOf("|", startIndex);

            if (endIndex == -1)
                endIndex = notes.Length;

            return notes.Substring(startIndex, endIndex - startIndex).Trim();
        }
        #endregion

        #region Upcoming CheckIns

        public async Task<List<UpcomingCheckInDto>>
            GetUpcomingCheckInsAsync()
        {
            var today = DateTime.Today;

            var bookings =
                await _unitOfWork.Bookings
                .GetAllQueryable()

                .Include(x => x.Guest)

                .Include(x => x.ReservationRooms)
                    .ThenInclude(r => r.Room)
                        .ThenInclude(rt => rt.RoomTypes)

                .Where(x =>
                    x.ReservationRooms.Any(r =>
                        r.CheckInDate.Date >= today
                    )
                )

                .OrderBy(x =>
                    x.ReservationRooms.Min(r => r.CheckInDate)
                )

                .ToListAsync();

            return bookings.Select(x => new UpcomingCheckInDto
            {
                BookingId = x.Id,

                BookingNumber = x.BookingNumber,

                GuestName =
                    x.Guest.FirstName + " " +
                    x.Guest.LastName,

                Mobile =
                    x.Guest.Phone,

                RoomNumbers =
                    string.Join(", ",
                        x.ReservationRooms
                            .Select(r => r.Room.RoomNumber)
                    ),

                RoomTypes =
                    string.Join(", ",
                        x.ReservationRooms
                            .Select(r => r.Room.RoomTypes.Name)
                    ),

                CheckInDate =
                    x.ReservationRooms.Min(r => r.CheckInDate),

                CheckOutDate =
                    x.ReservationRooms.Max(r => r.CheckOutDate),

                TotalAmount =
                    x.TotalAmount,

                BookingStatus =
                    x.Status.ToString()
            }).ToList();
        }

        #endregion

        #region  CheckInBookingAsync
        public async Task<bool> CheckInBookingAsync(int bookingId)
        {
            var booking = await _unitOfWork.Bookings
                .GetAllQueryable()
                .Include(x => x.ReservationRooms)
                .FirstOrDefaultAsync(x => x.Id == bookingId);

            if (booking == null)
                return false;

            booking.Status = BookingStatus.CheckedIn;

            foreach (var room in booking.ReservationRooms)
            {
                room.Status = BookingStatus.CheckedIn;

                var roomEntity = await _unitOfWork.Rooms
                    .GetByIdAsync(room.RoomId);

                if (roomEntity != null)
                {
                    roomEntity.Status = RoomStatus.Occupied;
                }
            }

            await _unitOfWork.SaveChangesAsync();

            return true;
        }
        #endregion

        #region 
        public async Task<object?> GetBookingByIdAsync(int bookingId)
        {
            var booking = await _unitOfWork.Bookings
                .GetAllQueryable()
                .Include(x => x.Guest)
                .Include(x => x.ReservationRooms)
                    .ThenInclude(x => x.Room)
                        .ThenInclude(x => x.RoomTypes)
                .FirstOrDefaultAsync(x => x.Id == bookingId);

            if (booking == null)
                return null;

            return new
            {
                id = booking.Id,

                bookingNumber = booking.BookingNumber,

                bookingStatus = booking.Status.ToString(),

                guestName =
                    $"{booking.Guest?.FirstName} {booking.Guest?.LastName}",

                mobile = booking.Guest?.Phone,

                email = booking.Guest?.Email,

                checkInDate = booking.ReservationRooms
                    .Min(x => x.CheckInDate),

                checkOutDate = booking.ReservationRooms
                    .Max(x => x.CheckOutDate),

                roomNumbers = string.Join(", ",
                    booking.ReservationRooms
                        .Select(x => x.Room!.RoomNumber)),

                roomTypes = string.Join(", ",
                    booking.ReservationRooms
                        .Select(x => x.Room!.RoomTypes!.Name)
                        .Distinct()),

                totalAmount = booking.TotalAmount,

                adults = booking.ReservationRooms.Sum(x => x.Adults),

                children = booking.ReservationRooms.Sum(x => x.Children)
            };
        }
        #endregion

        #region GetBookingForEditAsync
        public async Task<BookingEditDto?> GetBookingForEditAsync(int bookingId)
        {
            var booking = await _unitOfWork.Bookings
                     .GetAllQueryable()

             .Include(x => x.Guest)
             .Include(x => x.Invoices)

             .Include(x => x.ReservationRooms)
                 .ThenInclude(x => x.Room)

             .FirstOrDefaultAsync(x => x.Id == bookingId);

            if (booking == null)
                return null;
            var invoice = booking.Invoices
    .OrderByDescending(x => x.Id)
    .FirstOrDefault();

            var firstRoom = booking.ReservationRooms.FirstOrDefault();

            return new BookingEditDto
            {
                Id = booking.Id,

                BookingNumber = booking.BookingNumber,

                CheckIn = booking.ReservationRooms.Min(x => x.CheckInDate),

                CheckOut = booking.ReservationRooms.Max(x => x.CheckOutDate),

                TotalAmount = booking.TotalAmount,

                // Reservation Details
                BookingType = booking.BookingType ?? "",
                BookingReference = booking.BookingReference ?? "",
                SoldBy = booking.SoldBy ?? "",
                ArrivalFrom = booking.ArrivalFrom ?? "",
                CustomerProfile = booking.CustomerProfile ?? "",
                PurposeOfVisit = booking.PurposeOfVisit ?? "",
                Remarks = booking.Remarks ?? "",

                // Customer Info
                BillingFirstName = booking.Guest?.FirstName ?? "",
                BillingLastName = booking.Guest?.LastName ?? "",
                BillingMobile = booking.Guest?.Phone ?? "",
                BillingAddress = booking.Guest?.Address ?? "",
                Email = booking.Guest?.Email ?? "",
                //Gstin = booking.Guest?.Gstin ?? "",
                Title = booking.Guest?.Title ?? "",

                // Primary Guest
                GuestTitle = booking.Guest?.Title ?? "",
                GuestFirstName = booking.Guest?.FirstName ?? "",
                GuestLastName = booking.Guest?.LastName ?? "",
                GuestMobile = booking.Guest?.Phone ?? "",
                Nationality = booking.Guest?.Nationality ?? "Indian",

                // Billing
                // Billing (FROM INVOICE)
                BookingCharge = invoice?.Subtotal ?? 0,
                GstAmount = invoice?.Tax ?? 0,
                GrandTotal = invoice?.Total ?? 0,

                AdvanceAmount = invoice?.PaidAmount ?? 0,
                BalanceDue = invoice?.DueAmount ?? 0,
                Rooms = booking.ReservationRooms
                    .Select(r => new BookingRoomEditDto
                    {
                        RoomId = r.RoomId,

                        RoomTypeId = r.Room?.RoomTypesId ?? 0,

                        RoomNo = r.Room?.RoomNumber ?? "",

                        MealPlan = ExtractMealPlan(r.Notes),

                        Adults = r.Adults,

                        Children = r.Children,

                        ChildAge = r.ChildAge ?? "",

                        RentPerNight = r.RentPerNight,

                        ComplimentaryNight = r.ComplimentaryNight,

                        ExtraChildCharge = r.ExtraChildCharge,

                        TotalAmount = r.RoomAmount
                    })
                    .ToList()
            };
        }

        // public async Task<BookingEditDto?> GetBookingForEditAsync(int bookingId)
        // {
        //     var booking = await _unitOfWork.Bookings
        //         .GetAllQueryable()

        //         .Include(x => x.Guest)

        //         .Include(x => x.ReservationRooms)
        //             .ThenInclude(x => x.Room)
        //                 .ThenInclude(x => x.RoomTypes)

        //         .FirstOrDefaultAsync(x => x.Id == bookingId);

        //     if (booking == null)
        //         return null;

        //     var firstRoom =
        //         booking.ReservationRooms.FirstOrDefault();

        //     return new BookingEditDto
        //     {
        //         BookingId = booking.Id,

        //         BookingNumber = booking.BookingNumber,

        //         BookingType = booking.BookingType,
        //         BookingReference = booking.BookingReference,
        //         SoldBy = booking.SoldBy,
        //         ArrivalFrom = booking.ArrivalFrom,
        //         CustomerProfile = booking.CustomerProfile,
        //         PurposeOfVisit = booking.PurposeOfVisit,
        //         Remarks = booking.Remarks,

        //         CheckIn =
        //             booking.ReservationRooms.Min(x => x.CheckInDate),

        //         CheckOut =
        //             booking.ReservationRooms.Max(x => x.CheckOutDate),

        //         TotalAmount = booking.TotalAmount,

        //         BillingTitle = "",

        //         BillingFirstName =
        //             booking.Guest?.FirstName ?? "",

        //         BillingLastName =
        //             booking.Guest?.LastName ?? "",

        //         BillingMobile =
        //             booking.Guest?.Phone ?? "",

        //         BillingAddress =
        //             booking.Guest?.Address ?? "",

        //         Email =
        //             booking.Guest?.Email ?? "",

        //         Gstin = "",

        //         PaymentMode = "Cash",

        //         AdvanceAmount =
        //             booking.Invoices.FirstOrDefault()?.PaidAmount ?? 0,

        //         AdvanceRemarks = "",

        //         SameAsCustomer = true,

        //         PrimaryTitle = "",

        //         PrimaryFirstName =
        //             booking.Guest?.FirstName ?? "",

        //         PrimaryLastName =
        //             booking.Guest?.LastName ?? "",

        //         PrimaryMobile =
        //             booking.Guest?.Phone ?? "",

        //         Nationality = "Indian",

        //         Rooms = booking.ReservationRooms
        //             .Select(r => new BookingRoomEditDto
        //             {
        //                 ReservationRoomId = r.Id,

        //                 RoomId = r.RoomId,

        //                 RoomTypeId =
        //                     r.Room?.RoomTypesId ?? 0,

        //                 RoomNo =
        //                     r.Room?.RoomNumber ?? "",

        //                 MealPlan =
        //                     ExtractMealPlan(r.Notes),

        //                 Adults = r.Adults,

        //                 Children = r.Children,

        //                 TotalAmount = r.RoomAmount

        //             }).ToList()
        //     };
        // }

        #endregion
    }
}