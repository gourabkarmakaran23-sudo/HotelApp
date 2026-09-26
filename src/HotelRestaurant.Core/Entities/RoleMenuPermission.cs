namespace HotelRestaurant.Core.Entities;

public class RoleMenuPermission
{
    public string RoleName { get; set; } = string.Empty;
    public int MenuId { get; set; }
    public ApplicationMenu Menu { get; set; } = null!;
}