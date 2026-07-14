namespace HotelRestaurant.Application.DTOs.Master
{
    public class CancellationPolicyDto
    {
        public int Id { get; set; }
        public string PolicyName { get; set; } = string.Empty;
        public int CancellationWindowHours { get; set; }
        public decimal ChargePercentage { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}