namespace HotelRestaurant.Application.DTOs.Master;

public class CommissionAgentDto
{
    public int Id { get; set; }

    public string AgentName { get; set; } = string.Empty;
    // Added missing commission rate field (using decimal for financial precision)
    public decimal CommissionRate { get; set; }

    public string? Address { get; set; }

    public string? Mobile { get; set; }

    public string? Email { get; set; }

    public string? GSTIN { get; set; }

    public bool IsActive { get; set; } = true;
}