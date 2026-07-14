namespace HotelRestaurant.Application.DTOs.Master
{
    public class TaxDto
    {
        public int Id { get; set; }
        public string TaxName { get; set; } = string.Empty;
        public decimal TaxRate { get; set; }
        public string TaxCode { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}