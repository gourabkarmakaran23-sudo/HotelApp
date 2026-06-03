namespace HotelRestaurant.Application.DTOs.Master;

public class FinancialYearDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public bool IsActive { get; set; }
}