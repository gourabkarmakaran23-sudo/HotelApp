using System;

namespace HotelRestaurant.Application.DTOs
{
    public class CreateBookingDto
    {
        // Reservation Form Details
        public string BookingType { get; set; } = string.Empty;
        public string BookingReference { get; set; } = string.Empty;
        public string SoldBy { get; set; } = string.Empty;
        public string? ArrivalFrom { get; set; }
        public string? CustomerProfile { get; set; }
        public string? PurposeOfVisit { get; set; }
        public string? Remarks { get; set; }
        public string Pax { get; set; } = string.Empty;
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        
        // Target Identification Fields
        
        public decimal TotalAmount { get; set; } // Map to Subtotal

        // Customer Profile Information (Billing Info)
        public string BillingTitle { get; set; } = string.Empty;
        public string BillingFirstName { get; set; } = string.Empty;
        public string BillingLastName { get; set; } = string.Empty;
        public string BillingMobile { get; set; } = string.Empty;
        public string BillingAddress { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Gstin { get; set; }

        // Financial Settlement Variables
        public List<RoomBookingDto> Rooms { get; set; }
    = new();
        public string PaymentMode { get; set; } = string.Empty;
        public decimal AdvanceAmount { get; set; }
        public string? AdvanceRemarks { get; set; }

        // Primary Guest Information
        public bool SameAsCustomer { get; set; }
        public string PrimaryTitle { get; set; } = string.Empty;
        public string PrimaryFirstName { get; set; } = string.Empty;
        public string PrimaryLastName { get; set; } = string.Empty;
        public string PrimaryMobile { get; set; } = string.Empty;
        public string Nationality { get; set; } = "Indian";
    }
}