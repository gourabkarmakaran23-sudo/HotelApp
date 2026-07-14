using System;

namespace HotelRestaurant.Core.Entities
{
    public class Promocode
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty; // e.g., WELCOME10
        public string DiscountType { get; set; } = "Percentage"; // Percentage / Flat
        public decimal DiscountValue { get; set; }
        public decimal MinimumBookingAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int MaxUses { get; set; }
        public int UsedCount { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}