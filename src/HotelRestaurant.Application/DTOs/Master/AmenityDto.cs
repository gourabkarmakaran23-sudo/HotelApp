namespace HotelRestaurant.Application.DTOs.Master
{
    public class AmenityDto
    {
        public int Id { get; set; }
        public string AmenityName { get; set; } = string.Empty;
        public string? IconClass { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}