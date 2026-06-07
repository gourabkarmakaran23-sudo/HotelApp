using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
   public class PurchaseReturn : BaseEntity
    {
        public string ItemName { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
        public string ReferenceInvoiceNo { get; set; } = string.Empty;
        public decimal ReturnQuantity { get; set; }
        public string Unit { get; set; } = "Pcs";
        public decimal RefundRate { get; set; }
        public decimal TotalRefundAmount { get; set; }
        public DateTime ReturnDate { get; set; }
        public string ReasonForReturn { get; set; } = string.Empty;
    }
}