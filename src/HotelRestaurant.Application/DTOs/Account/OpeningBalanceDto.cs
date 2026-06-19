using System;

namespace HotelRestaurant.Application.DTOs.Account
{
    public class OpeningBalanceDto
    {
        public int Id { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string AccountType { get; set; } = string.Empty; // e.g., Bank, Cash, Asset
        public decimal Amount { get; set; }
        public string BalanceType { get; set; } = "Debit"; // Debit or Credit
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string? Remarks { get; set; }
        public bool IsActive { get; set; } = true;
    }
}