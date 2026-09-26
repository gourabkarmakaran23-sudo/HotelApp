namespace HotelRestaurant.Api.Models;

public sealed record MenuPermissionOptionDto(
    string Route,
    string Label,
    string Category,
    int SortOrder);

public sealed record UpdateRoleMenuPermissionsRequest(string[] Routes);