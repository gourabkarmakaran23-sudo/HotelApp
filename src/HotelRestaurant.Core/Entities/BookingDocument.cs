using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{

    [Table("BookingDocuments")]
    public class BookingDocument
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookingId { get; set; }

        public int? BookingGuestId { get; set; } // Links directly to the specific companion row

        [Required]
        [StringLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string FilePath { get; set; } = string.Empty;

        [Required]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        // Navigation property (Optional, but highly recommended if you have a Booking entity)
         [ForeignKey("BookingId")]
         public virtual Booking? Booking { get; set; }
    }

}