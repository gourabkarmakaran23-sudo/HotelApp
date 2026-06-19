using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class PurchaseItem : BaseEntity
    {
        public string ItemName { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
        public string InvoiceNumber { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "Pcs"; // Pcs, Kg, Ltr, etc.
        public decimal Rate { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string? Remarks { get; set; }

        // Soft Delete tracker baseline 
        public bool IsDeleted { get; set; } = false;
    }
}