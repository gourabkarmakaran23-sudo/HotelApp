using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities.HouseKeeping
{
    public class LaundryLog
    {
        public int Id { get; set; }
        [Required]
        public string InvoiceNo { get; set; }
        [Required]
        public string LaundryName { get; set; }
        [Required]
        public string ItemName { get; set; }
        [Required]
        public string OperateBy { get; set; }
        [Required]
        public string TaskName { get; set; }
        public decimal ItemCost { get; set; }
        public int Quantity { get; set; }
        public string Type { get; set; }
        public DateTime SendDate { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public string PaymentStatus { get; set; } = "Pending"; // Paid, Due, Partial
        public string Comments { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}