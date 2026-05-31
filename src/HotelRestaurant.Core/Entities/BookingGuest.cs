using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelRestaurant.Core.Entities
{
    [Table("BookingGuests")]
    public class BookingGuest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int BookingId { get; set; }

        [ForeignKey("BookingId")]
        public virtual Booking? Booking { get; set; }

        [Required]
        [MaxLength(20)]
        public string RoomNo { get; set; } = string.Empty;

        [MaxLength(10)]
        public string Title { get; set; } = "Mr.";

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Mobile { get; set; } = string.Empty;

        [MaxLength(15)]
        public string Gender { get; set; } = "Male";

        public int? Age { get; set; }

        [MaxLength(50)]
        public string IdType { get; set; } = "Aadhar Card";

        [MaxLength(50)]
        public string IdNumber { get; set; } = string.Empty;

        public bool IsPrimary { get; set; } = false;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        
        
    }
}