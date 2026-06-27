namespace HotelRestaurant.Application.DTOs.OtherPayment
{
    public class OtherPaymentInvoiceItemDto
    {
        public string Type { get; set; } = "Service";
        public string? Hsn { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Unit { get; set; } = "Pcs";
        public decimal Rate { get; set; }
        public int Qty { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GstRate { get; set; }
        public string GstType { get; set; } = "CGST+SGST";
        public decimal GstAmount { get; set; }
        public decimal Total { get; set; }
    }
}