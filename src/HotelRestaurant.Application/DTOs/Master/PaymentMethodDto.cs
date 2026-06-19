namespace HotelRestaurant.Application.DTOs.Master;

public class PaymentMethodDto
{
    public int Id { get; set; }

    public string MethodName { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}