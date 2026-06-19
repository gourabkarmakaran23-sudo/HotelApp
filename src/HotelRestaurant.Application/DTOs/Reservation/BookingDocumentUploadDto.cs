using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace HotelRestaurant.Application.DTOs.Reservation
{
    public class BookingDocumentUploadDto
    {
        [Required]
        public IFormFile File { get; set; } = null!;

        [Required]
        public int BookingId { get; set; }

        public int? BookingGuestId { get; set; }
    }
}