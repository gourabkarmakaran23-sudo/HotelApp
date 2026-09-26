namespace HotelRestaurant.Core.Entities;

public class ApplicationMenu
{
    public int Id { get; set; }
    public string Route { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsSuperAdminOnly { get; set; }
    public ICollection<RoleMenuPermission> RolePermissions { get; set; } = new List<RoleMenuPermission>();
}