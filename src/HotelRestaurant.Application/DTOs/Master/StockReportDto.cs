using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.Master
{
  public class StockReportDto
    {
        public string ItemName { get; set; } = string.Empty;
        public decimal TotalPurchased { get; set; }
        public decimal TotalReturned { get; set; }
        public decimal CurrentStock { get; set; }
        public string Unit { get; set; } = "Pcs";
        public decimal AverageRate { get; set; }
        public decimal TotalStockValue { get; set; }
        public string Status { get; set; } = "In Stock"; // In Stock, Low Stock, Out of Stock
    }
}