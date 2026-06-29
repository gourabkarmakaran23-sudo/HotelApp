namespace HotelRestaurant.Core.Entities
{
    public enum RefundStatus
    {
        Due = 0,          // Refund Due (Non-Website Booking)
        UnderProcess = 1, // Refund Under Process
        Refunded = 2      // Refunded Archives
    }

    public class RefundRecord
    {
        public int Id { get; set; }
        public string BookingId { get; set; } = string.Empty;
        public string GuestName { get; set; } = string.Empty;
        public decimal RefundAmount { get; set; }
        public RefundStatus Status { get; set; } = RefundStatus.Due;
        public bool IsDeleted { get; set; } = false;

        // --- Stage 1: Refund Due Additional Info ---
        public string? BookingSource { get; set; } // e.g. Walk-In, MakeMyTrip
        public DateTime? RequestDate { get; set; }
        public string? Remarks { get; set; }

        // --- Stage 2: Refund Under Process Info ---
        public string? BankName { get; set; }
        public string? AccountNo { get; set; }
        public string? IfscCode { get; set; }
        public string? ProcessStatus { get; set; } // e.g. Sent to Accounts, Awaiting GM Approval

        // --- Stage 3: Refunded Archives Info ---
        public string? RefundChannel { get; set; } // e.g. UPI, Net Banking, Cash
        public string? TransactionId { get; set; } // UTR Reference
        public DateTime? RefundedDate { get; set; }
        public string? AttachmentName { get; set; } // Snapshot file name
    }
}