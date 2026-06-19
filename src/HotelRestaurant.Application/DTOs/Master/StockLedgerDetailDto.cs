using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.Master
{
    public class StockLedgerDetailDto
    {
        public DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; } = string.Empty; // Purchase or Return
        public string ReferenceNo { get; set; } = string.Empty; // Invoice or Return Reference
        public string SupplierName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "Pcs";
        public decimal Rate { get; set; }
        public decimal TotalAmount { get; set; }
    }
}