using System;

namespace HotelRestaurant.Core.Entities
{
    public class CancellationPolicy
    {
        public int Id { get; set; }
        public string PolicyName { get; set; } = string.Empty;
        public int CancellationWindowHours { get; set; } // e.g., 48 hours before check-in
        public decimal ChargePercentage { get; set; } // e.g., 50% or 100% deduction
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}