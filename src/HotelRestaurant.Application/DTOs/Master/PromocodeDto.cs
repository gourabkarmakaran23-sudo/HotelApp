using System;

namespace HotelRestaurant.Application.DTOs.Master
{
    public class PromocodeDto
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string DiscountType { get; set; } = "Percentage";
        public decimal DiscountValue { get; set; }
        public decimal MinimumBookingAmount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int MaxUses { get; set; }
        public bool IsActive { get; set; }
    }
}