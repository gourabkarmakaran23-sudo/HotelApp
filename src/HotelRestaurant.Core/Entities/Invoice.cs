namespace HotelRestaurant.Core.Entities
{
    public class Invoice : BaseEntity
    {
        // public int? ReservationId { get; set; }
        // public int? OrderId { get; set; }
        // public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        // public decimal Subtotal { get; set; }
        // public decimal Tax { get; set; }
        // public decimal Total { get; set; }
        // public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;

        // public Reservation? Reservation { get; set; }
        // public Order? Order { get; set; }

        //New
        public int? ReservationId { get; set; }
        public int? OrderId { get; set; }
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        
        // Maps directly to the breakdown logic evaluated in your engine forms
        public decimal Subtotal { get; set; } // Maps to form.totalAmount
        public decimal Tax { get; set; }      // Maps to GST (5%) calculation
        public decimal Total { get; set; }    // Maps to total including tax
        
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;

        // Clear mapping configurations to the updated Reservation
        public Reservation? Reservation { get; set; }
        public Order? Order { get; set; }
    }
}
