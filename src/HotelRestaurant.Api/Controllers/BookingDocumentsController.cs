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
    [Route("api/[controller]")]
    public class BookingDocumentsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly string _storageFolder;
        private readonly IReservationService _reservationService;

        public BookingDocumentsController(
            IUnitOfWork unitOfWork,
            IReservationService reservationService)
        {
            _unitOfWork = unitOfWork;
            _reservationService = reservationService;

            // Defines a directory named "UploadedDocuments" at your API execution root
            _storageFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedDocuments");

            // Create folder automatically if it doesn't exist yet
            if (!Directory.Exists(_storageFolder))
            {
                Directory.CreateDirectory(_storageFolder);
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadDocument([FromForm] BookingDocumentUploadDto dto)
        {
            // 1. Validation Checks using your new encapsulated DTO values
            if (dto == null || dto.File == null || dto.File.Length == 0)
                return BadRequest(new { message = "No file was attached to the request framework." });

            if (dto.BookingId <= 0)
                return BadRequest(new { message = "A valid Booking reference context must be supplied." });

            try
            {
                // 2. Generate a Unique Filename
                string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(dto.File.FileName)}";
                string targetPhysicalPath = Path.Combine(_storageFolder, uniqueFileName);

                // 3. Save the Physical Asset File stream onto the Server's Hard Drive
                using (var stream = new FileStream(targetPhysicalPath, FileMode.Create))
                {
                    await dto.File.CopyToAsync(stream);
                }

                // 4. Save the relative path metadata parameters to your Entity Framework database context
                var documentRecord = new BookingDocument
                {
                    BookingId = dto.BookingId,
                    BookingGuestId = dto.BookingGuestId, // Successfully linked to your database record!
                    FileName = dto.File.FileName,
                    FilePath = Path.Combine("UploadedDocuments", uniqueFileName),
                    UploadedAt = DateTime.UtcNow
                };

                await _unitOfWork.BookingDocuments.AddAsync(documentRecord);
                // ==========================================================
                // FIX: EXPLICITLY UPDATE THE GUEST'S IDNUMBER IN THE DATABASE
                // ==========================================================
                if (dto.BookingGuestId.HasValue && dto.BookingGuestId.Value > 0)
                {
                    // Look up the companion row from the BookingGuests table
                    var guestRecord = await _unitOfWork.BookingGuests.GetByIdAsync(dto.BookingGuestId.Value);
                    // Note: Use _context.BookingGuests.FindAsync() if using standard DbContext instead of a Unit of Work repository

                    if (guestRecord != null)
                    {
                        // Assign "FILE-ATTACHED" to the column so it matches your business logic
                        guestRecord.IdNumber = "FILE-ATTACHED";

                        // If you are tracking the filename directly on the guest row as well:
                        // guestRecord.UploadedFileName = dto.File.FileName;
                    }
                }
                // ==========================================================
                await _unitOfWork.SaveChangesAsync();

                return Ok(new
                {
                    message = "Document uploaded and logged successfully.",
                    documentId = documentRecord.Id,
                    fileName = dto.File.FileName
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Database Error processing stay: {ex.Message}");
            }
        }
    }
}