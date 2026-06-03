namespace HotelRestaurant.Application.DTOs.Master;

public class CurrencyDto
{
    public int Id { get; set; }

    public string CurrencyName { get; set; } = string.Empty;

    public string CurrencyIcon { get; set; } = string.Empty;

    public string Position { get; set; } = "Left";

    public decimal ConversionRate { get; set; }

    public bool IsActive { get; set; } = true;
}