namespace HotelRestaurant.Core.Entities
{
    public class Invoice : BaseEntity
    {
        public int? ReservationId { get; set; }
        public int? OrderId { get; set; }
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;

        public Reservation? Reservation { get; set; }
        public Order? Order { get; set; }
    }
}
