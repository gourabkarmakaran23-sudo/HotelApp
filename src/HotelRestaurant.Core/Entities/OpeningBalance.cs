using System;

namespace HotelRestaurant.Core.Entities
{
    public class OpeningBalance
    {
        public int Id { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty; // e.g., Bank, Cash, Asset, Liability
        public decimal Amount { get; set; }
        public string BalanceType { get; set; } = "Debit"; // Debit or Credit
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string? Remarks { get; set; }
        
        // Audit and soft-delete properties to match your repository pattern
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}