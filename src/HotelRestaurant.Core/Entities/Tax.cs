using System;

namespace HotelRestaurant.Core.Entities
{
    public class Tax
    {
        public int Id { get; set; }
        public string TaxName { get; set; } = string.Empty;
        public decimal TaxRate { get; set; } // e.g., 18.00
        public string TaxCode { get; set; } = string.Empty; // HSN/SAC Code
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}