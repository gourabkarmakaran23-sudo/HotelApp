// File: HouseKeepingDTOs.cs
using System;

namespace HotelRestaurant.Application.DTOs
{
    public class RoomCleaningDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string RoomNo { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }

    public class ChecklistDto
    {
        public int Id { get; set; }
        public string TaskName { get; set; }
        public string Type { get; set; }
    }

    public class LaundryLogDto
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; }
        public string LaundryName { get; set; }
        public string ItemName { get; set; }
        public string OperateBy { get; set; }
        public string TaskName { get; set; }
        public decimal ItemCost { get; set; }
        public int Quantity { get; set; }
        public string Type { get; set; }
        public DateTime SendDate { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public string PaymentStatus { get; set; }
        public string Comments { get; set; }

        // 🚀 ADD THESE THREE MISSING FIELDS FOR INVENTORY COUNTS
        public int InUse { get; set; }
        public int InLaundry { get; set; }
        public int Ready { get; set; }

        
    }

    public class LaundryPaymentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string InvoiceNo { get; set; }
        public string LaundryName { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal DueAmount { get; set; }
        public decimal PaidAmount { get; set; }
    }
}