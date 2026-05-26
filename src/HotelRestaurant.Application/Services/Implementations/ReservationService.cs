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

        #region CheckIn List
        // public async Task<List<CheckInListDto>> GetCheckInListAsync()
        // {
        //     var reservations = await _unitOfWork.Reservations
        //         .GetAllQueryable()
        //         .Include(g => g.Guest)
        //         .Include(x => x.Room)
        //         .ThenInclude(r => r.RoomTypes)
        //         .Include(x => x.Invoice)
        //         .ToListAsync();

        //     return reservations.Select(x => new CheckInListDto
        //     {
        //         ReservationId = x.Id,

        //         BookingNumber = x.BookingNumber,

        //         CustomerName =
        //             x.Guest != null
        //                 ? x.Guest.FirstName + " " + x.Guest.LastName
        //                 : "",

        //         GuestName =
        //             x.Guest != null
        //                 ? x.Guest.FirstName + " " + x.Guest.LastName
        //                 : "",

        //         RoomNo = x.Room != null
        //             ? x.Room.RoomNumber
        //             : "",

        //         RoomType = x.Room?.RoomTypes?.Name ?? "",
        //         MealPlan = ExtractMealPlan(x.Notes),
        //         Pax = x.Pax,
        //         Mobile = x.Guest != null
        //         ? x.Guest.Phone
        //         : "",

        //         PaidAmount = x.Invoice != null
        //             ? x.Invoice.PaidAmount
        //             : 0,

        //         DueAmount = x.Invoice != null
        //             ? x.Invoice.DueAmount
        //             : 0,

        //         CheckInDate = x.CheckInDate,

        //         CheckOutDate = x.CheckOutDate,

        //         BookingStatus = x.Status.ToString()

        //     }).ToList();

        // }

        // private string ExtractMealPlan(string notes)
        // {
        //     if (string.IsNullOrWhiteSpace(notes))
        //         return "";

        //     var planKey = "Plan:";

        //     var startIndex = notes.IndexOf(planKey);

        //     if (startIndex == -1)
        //         return "";

        //     startIndex += planKey.Length;

        //     var endIndex = notes.IndexOf("|", startIndex);

        //     if (endIndex == -1)
        //         endIndex = notes.Length;

        //     return notes.Substring(startIndex, endIndex - startIndex).Trim();
        // }
        #endregion
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


    }
}