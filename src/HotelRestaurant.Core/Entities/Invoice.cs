namespace HotelRestaurant.Core.Entities
{
    public class Invoice : BaseEntity
    {
        //New
        // public int? ReservationId { get; set; }
        public int BookingId { get; set; }
        public int? OrderId { get; set; }
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;

        // Maps directly to the breakdown logic evaluated in your engine forms
        public decimal Subtotal { get; set; } // Maps to form.totalAmount
        public decimal Tax { get; set; }      // Maps to GST (5%) calculation
        public decimal Total { get; set; }    // Maps to total including tax

        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;

        public decimal PaidAmount { get; set; }

        public decimal DueAmount { get; set; }
        // Clear mapping configurations to the updated Reservation
        // public Reservation? Reservation { get; set; }
        public Booking? Booking { get; set; }
        public Order? Order { get; set; }
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
