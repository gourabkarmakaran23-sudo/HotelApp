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
using HotelRestaurant.Application.DTOs;

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


        #region Create Booking Core Logic (Refactored from Controller)
        public async Task<BookingResultDto> CreateBookingAsync(CreateBookingDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto), "Payload cannot be empty.");

            // 1. Process String Fallbacks
            string validatedFirstName = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingFirstName : dto.PrimaryFirstName) ? "WalkIn" : (dto.SameAsCustomer ? dto.BillingFirstName : dto.PrimaryFirstName);
            string validatedLastName = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingLastName : dto.PrimaryLastName) ? "Guest" : (dto.SameAsCustomer ? dto.BillingLastName : dto.PrimaryLastName);
            string validatedPhone = string.IsNullOrWhiteSpace(dto.SameAsCustomer ? dto.BillingMobile : dto.PrimaryMobile) ? "0000000000" : (dto.SameAsCustomer ? dto.BillingMobile : dto.PrimaryMobile);

            // 2. Create the Primary Guest Account Profile (Main Booker/Billing entity)
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

            // 3. Create Booking Container
            var bookingNumber = $"RES-{DateTime.Now:yyyyMMddHHmmss}";
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

            // 4. Create Reservation Rooms & Seed Initial BookingGuests Entries
            var roomsList = await _unitOfWork.Rooms.GetAllAsync();
            foreach (var roomDto in dto.Rooms)
            {
                var room = roomsList.FirstOrDefault(r => r.RoomNumber.Trim() == roomDto.RoomNo.Trim());
                if (room == null) continue;

                // Check Room Availability State
                var alreadyBooked = await _unitOfWork.ReservationRooms.GetAllQueryable()
                    .AnyAsync(x => x.RoomId == room.Id
                              && dto.CheckIn < x.CheckOutDate
                              && dto.CheckOut > x.CheckInDate
                              && x.Status != BookingStatus.Cancelled);

                if (alreadyBooked)
                {
                    throw new InvalidOperationException($"Room {room.RoomNumber} is already booked for selected dates.");
                }

                var reservationRoom = new ReservationRoom
                {
                    BookingId = booking.Id,
                    RoomId = room.Id,
                    CheckInDate = dto.CheckIn,
                    CheckOutDate = dto.CheckOut,
                    Adults = roomDto.Adults,
                    Children = roomDto.Children,
                    RoomAmount = roomDto.TotalAmount,
                    Status = BookingStatus.Pending,
                    Notes = $"Plan: {roomDto.MealPlan}",
                    Pax = (roomDto.Adults + roomDto.Children).ToString()
                };

                await _unitOfWork.ReservationRooms.AddAsync(reservationRoom);
                room.Status = RoomStatus.Reserved;

                // CRITICAL ADDITION: Create occupant profile tracking records for EVERY single room allocated
                var initialOccupantRow = new BookingGuest
                {
                    BookingId = booking.Id,
                    RoomNo = roomDto.RoomNo.Trim(),
                    Title = "Mr.",
                    FirstName = validatedFirstName,  // Defaults to Rahul for room 101 AND 102
                    LastName = validatedLastName,
                    Mobile = validatedPhone,
                    Gender = "Male",
                    Age = null,
                    IdType = "Aadhar Card",
                    IdNumber = "",
                    IsPrimary = (booking.ReservationRooms.Count == 0), // true only for the first room item processed
                    UpdatedAt = DateTime.UtcNow
                };
                await _unitOfWork.BookingGuests.AddAsync(initialOccupantRow);
            }

            await _unitOfWork.SaveChangesAsync();

            // 5. Create Invoice Log Context
            var invoice = new Invoice
            {
                BookingId = booking.Id,
                InvoiceDate = DateTime.UtcNow,
                Subtotal = dto.TotalAmount,
                Tax = dto.TotalAmount * 0.05m,
                Total = dto.TotalAmount * 1.05m,
                PaidAmount = dto.AdvanceAmount,
                DueAmount = (dto.TotalAmount * 1.05m) - dto.AdvanceAmount,
                PaymentStatus = dto.AdvanceAmount >= dto.TotalAmount ? PaymentStatus.Paid : dto.AdvanceAmount > 0 ? PaymentStatus.PartiallyPaid : PaymentStatus.Unpaid
            };

            await _unitOfWork.Invoices.AddAsync(invoice);
            await _unitOfWork.SaveChangesAsync();

            return new BookingResultDto
            {
                Success = true,
                BookingId = booking.Id,
                BookingNumber = booking.BookingNumber,
                GuestId = guest.Id,
                InvoiceId = invoice.Id
            };
        }
        #endregion

        #region Update Specific Room Occupants List
        public async Task<bool> UpdateBookingOccupantsAsync(int bookingId, List<BookingGuestUpdateDto> guestDtos)
        {
            if (guestDtos == null) return false;

            // 1. Fetch the booking along with its existing guests from the database tracking layers
            var booking = await _unitOfWork.Bookings.GetAllQueryable()
                .Include(b => b.BookingGuests)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null) return false;

            // Ensure the collection is initialized
            booking.BookingGuests ??= new List<BookingGuest>();

            // 2. Identify which guests to delete: Exist in DB but missing from the incoming DTO request list
            var incomingIds = guestDtos.Where(d => d.Id.HasValue && d.Id.Value > 0).Select(d => d.Id!.Value).ToList();
            var guestsToDelete = booking.BookingGuests.Where(g => !incomingIds.Contains(g.Id)).ToList();

            if (guestsToDelete.Any())
            {
                _unitOfWork.BookingGuests.DeleteRange(guestsToDelete);
            }

            // 3. Process the incoming list loop
            foreach (var dto in guestDtos)
            {
                // Case A: Existing Guest -> Look up the existing tracked record and update it
                if (dto.Id.HasValue && dto.Id.Value > 0)
                {
                    var existingGuest = booking.BookingGuests.FirstOrDefault(g => g.Id == dto.Id.Value);
                    if (existingGuest != null)
                    {
                        existingGuest.RoomNo = dto.RoomNo?.Trim() ?? string.Empty;
                        existingGuest.Title = dto.Title ?? "Mr.";

                        // Note: Ensure your backend property names match your schema mapping (FirstName or GuestFirstName)
                        existingGuest.FirstName = dto.GuestFirstName?.Trim() ?? string.Empty;
                        existingGuest.LastName = dto.GuestLastName?.Trim() ?? string.Empty;

                        existingGuest.Mobile = dto.Mobile?.Trim() ?? string.Empty;
                        existingGuest.Gender = dto.Gender ?? "Male";
                        existingGuest.Age = dto.Age;
                        existingGuest.IdType = dto.IdType ?? "Aadhar Card";

                        // CRITICAL FIX: Only overwrite IdNumber if the incoming DTO provides a new non-empty value.
                        // This prevents your file-upload status tracker from being cleared out when saving names!
                        if (!string.IsNullOrWhiteSpace(dto.IdNumber))
                        {
                            existingGuest.IdNumber = dto.IdNumber.Trim();
                        }

                        existingGuest.UpdatedAt = DateTime.UtcNow;
                    }
                }
                // Case B: New Guest Entry -> Create a fresh database entity row mapping
                else
                {
                    var newOccupant = new BookingGuest
                    {
                        BookingId = bookingId,
                        RoomNo = dto.RoomNo?.Trim() ?? string.Empty,
                        Title = dto.Title ?? "Mr.",
                        FirstName = dto.GuestFirstName?.Trim() ?? string.Empty,
                        LastName = dto.GuestLastName?.Trim() ?? string.Empty,
                        Mobile = dto.Mobile?.Trim() ?? string.Empty,
                        Gender = dto.Gender ?? "Male",
                        Age = dto.Age,
                        IdType = dto.IdType ?? "Aadhar Card",
                        IdNumber = dto.IdNumber?.Trim() ?? string.Empty,
                        UpdatedAt = DateTime.UtcNow
                    };
                    await _unitOfWork.BookingGuests.AddAsync(newOccupant);
                }
            }

            // 4. Commit all tracking updates securely to your permanent relational database storage
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
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
                BookingDate = x.CreatedAt.Date,
                RoomTypes =
                    string.Join(", ",
                        x.ReservationRooms
                            .Select(r => r.Room.RoomTypes.Name)
                    ),

                RoomNumbers =
                    string.Join(", ",
                        x.ReservationRooms
                            .Select(r => r.Room.RoomNumber)
                    ),
                MealPlan =
                    string.Join(", ",
                        x.ReservationRooms
                            .Select(r => ExtractMealPlan(r.Notes))
                            .Where(mp => !string.IsNullOrEmpty(mp))
                            .Distinct()
                    ),
                Pax =
                    x.ReservationRooms.Sum(r => Convert.ToInt32(r.Pax)),

                GuestName =
                    x.Guest.FirstName + " " +
                    x.Guest.LastName,

                Mobile =
                    x.Guest.Phone,



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
                 .Include(x => x.BookingGuests) // <-- CRITICAL: Include the backend navigation property here
                .Include(x => x.ReservationRooms)

                    .ThenInclude(x => x.Room)

                .FirstOrDefaultAsync(x => x.Id == bookingId);

            if (booking == null)
                return null;

            var invoice = booking.Invoices
                .OrderByDescending(x => x.Id)
                .FirstOrDefault();
            // 1. Fetch any files attached to this reservation from the context
            var relatedDocuments = await _unitOfWork.BookingDocuments
                .GetAllQueryable()
                .Where(d => d.BookingId == bookingId)
                .ToListAsync();

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
                Title = booking.Guest?.Title ?? "",

                // Primary Guest
                GuestTitle = booking.Guest?.Title ?? "",
                GuestFirstName = booking.Guest?.FirstName ?? "",
                GuestLastName = booking.Guest?.LastName ?? "",
                GuestMobile = booking.Guest?.Phone ?? "",
                Nationality = booking.Guest?.Nationality ?? "Indian",

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
                    .ToList(),

                // ADD THIS MAPPING BLOCK: 
                BookingGuests = booking.BookingGuests
                    .Select(bg =>
                    {
                        // // Find a matching document context record using unique identifiers passed up during uploading
                        // var matchingDoc = relatedDocuments.FirstOrDefault(d =>
                        //     d.FileName.Contains(bg.FirstName) &&
                        //     d.FileName.Contains(bg.RoomNo)
                        // );
                        // FIX: Be careful with column name mappings here! 
                        // We match by comparing the database 'FirstName' with the Document metadata safely
                        var matchingDoc = relatedDocuments.FirstOrDefault(d =>
                            d.BookingGuestId == bg.Id
                        );

                        return new BookingGuestEditDto
                        {

                            // Fallback to room logic or mapping fields explicitly based on your DB schema properties
                            Id = bg.Id,
                            BookingId = bg.BookingId,
                            RoomNo = bg.RoomNo ?? bg.RoomNo ?? "",
                            Title = bg.Title ?? "Mr.",
                            GuestFirstName = bg.FirstName ?? bg.FirstName ?? "",
                            GuestLastName = bg.LastName ?? bg.LastName ?? "",
                            Mobile = bg.Mobile ?? "",
                            Gender = bg.Gender ?? "Male",
                            Age = bg.Age,
                            IdType = bg.IdType ?? "Aadhar Card",
                            IdNumber = bg.IdNumber ?? "",
                            // MAP IT HERE (Assuming your entity or a linked table tracks the filename)
                            // Match found? Use its original file title. Otherwise, default to blank.
                            UploadedFileName = matchingDoc != null ? matchingDoc.FileName : ""
                        };
                    })
                    .ToList()
            };
        }
        #endregion
    }
}