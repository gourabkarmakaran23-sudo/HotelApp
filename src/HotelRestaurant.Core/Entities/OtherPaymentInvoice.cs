using System;
using System.Collections.Generic;

namespace HotelRestaurant.Core.Entities
{
    public class OtherPaymentInvoice
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string? CustomerAddress { get; set; }
        public string? Gstin { get; set; }
        public string? Remarks { get; set; }
        public string? AttachmentName { get; set; } // ফাইল ট্র্যাকিং এর জন্য
        
        // Summaries
        public decimal SubTotalSummary { get; set; }
        public decimal TotalGstSummary { get; set; }
        public decimal Adjustment { get; set; }
        public decimal RoundOff { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal PaidAmount { get; set; } // লিস্ট পেজে ট্র্যাকিং এর জন্য
        public decimal DueAmount => InvoiceAmount - PaidAmount;

        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Property for Grid Rows
        public ICollection<OtherPaymentInvoiceItem> Items { get; set; } = new List<OtherPaymentInvoiceItem>();
    }
}