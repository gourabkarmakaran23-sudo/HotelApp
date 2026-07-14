namespace HotelRestaurant.Application.DTOs.CheckOut
{
    public class CheckOutBookingDto
    {
        public string PaymentMode { get; set; } = string.Empty;
        public decimal Subtotal { get; set; }
        public decimal AdditionalCharges { get; set; }
        public decimal AdjustmentAmount { get; set; }
    }
}
