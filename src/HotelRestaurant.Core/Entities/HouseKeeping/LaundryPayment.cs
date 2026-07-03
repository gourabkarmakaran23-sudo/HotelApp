using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities.HouseKeeping
{
    // ৪. Laundry Payment Ledger Entity
    public class LaundryPayment
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string InvoiceNo { get; set; }
        [Required]
        public string LaundryName { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DueAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}