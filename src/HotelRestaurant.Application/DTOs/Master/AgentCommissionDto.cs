namespace HotelRestaurant.Application.DTOs.Master;

public class AgentCommissionDto
{
    public int Id { get; set; }

    public int AgentId { get; set; }

    public string BookingNumber { get; set; } = string.Empty;

    public int CommissionAgentId { get; set; }

    public string AgentName { get; set; } = string.Empty;

    public decimal CommissionPercentage { get; set; }

    public decimal CommissionAmount { get; set; }

    public string PaymentStatus { get; set; } = "Due";

    public DateTime? PaidDate { get; set; }
}