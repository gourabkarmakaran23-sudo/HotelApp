using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Application.DTOs.RefundRecord
{
    public class RefundRecordDto
    {
        public int Id { get; set; }
        public string BookingId { get; set; } = null!;
        public string GuestName { get; set; } = null!;
        public decimal RefundAmount { get; set; }
        public RefundStatus Status { get; set; }
        
        // Due Stage
        public string? BookingSource { get; set; }
        public DateTime? RequestDate { get; set; }
        public string? Remarks { get; set; }

        // Processing Stage
        public string? BankName { get; set; }
        public string? AccountNo { get; set; }
        public string? IfscCode { get; set; }
        public string? ProcessStatus { get; set; }

        // Refunded Stage
        public string? RefundChannel { get; set; }
        public string? TransactionId { get; set; }
        public DateTime? RefundedDate { get; set; }
        public string? AttachmentName { get; set; }
    }

    public class UpsertRefundRecordDto
    {
        public int Id { get; set; }
        public string BookingId { get; set; } = null!;
        public string GuestName { get; set; } = null!;
        public decimal RefundAmount { get; set; }
        public RefundStatus Status { get; set; }
        
        public string? BookingSource { get; set; }
        public DateTime? RequestDate { get; set; }
        public string? Remarks { get; set; }

        public string? BankName { get; set; }
        public string? AccountNo { get; set; }
        public string? IfscCode { get; set; }
        public string? ProcessStatus { get; set; }

        public string? RefundChannel { get; set; }
        public string? TransactionId { get; set; }
        public DateTime? RefundedDate { get; set; }
        public string? AttachmentName { get; set; }
    }
}