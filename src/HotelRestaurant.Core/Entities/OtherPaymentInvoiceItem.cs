namespace HotelRestaurant.Core.Entities
{
    public class OtherPaymentInvoiceItem
    {
        public int Id { get; set; }
        public int OtherPaymentInvoiceId { get; set; }
        
        public string Type { get; set; } = "Service"; // Product / Service
        public string? Hsn { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Unit { get; set; } = "Pcs";
        public decimal Rate { get; set; }
        public int Qty { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GstRate { get; set; }
        public string GstType { get; set; } = "CGST+SGST"; // CGST+SGST, IGST
        public decimal GstAmount { get; set; }
        public decimal Total { get; set; }

        // Navigation Link
        public OtherPaymentInvoice? OtherPaymentInvoice { get; set; }
    }
}