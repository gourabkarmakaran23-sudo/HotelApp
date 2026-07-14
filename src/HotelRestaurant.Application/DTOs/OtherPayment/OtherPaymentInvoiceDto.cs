using System;
using System.Collections.Generic;

namespace HotelRestaurant.Application.DTOs.OtherPayment
{
    public class OtherPaymentInvoiceDto
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string? CustomerAddress { get; set; }
        public string? Gstin { get; set; }
        public string? Remarks { get; set; }
        public string? AttachmentName { get; set; }

        public decimal SubTotalSummary { get; set; }
        public decimal TotalGstSummary { get; set; }
        public decimal Adjustment { get; set; }
        public decimal RoundOff { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal DueAmount { get; set; }

        public List<OtherPaymentInvoiceItemDto> Items { get; set; } = new List<OtherPaymentInvoiceItemDto>();
    }
}