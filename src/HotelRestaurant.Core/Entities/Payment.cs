using System;

namespace HotelRestaurant.Core.Entities
{
    public class Payment : BaseEntity
    {
        public string ReceiptNo { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; } = PaymentMethod.Cash;
        public string Remarks { get; set; } = string.Empty;

        // Relations
        public int? BookingId { get; set; }
        public Booking? Booking { get; set; }

        public int? InvoiceId { get; set; }
        public Invoice? Invoice { get; set; }
    }
}
