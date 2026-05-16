namespace HotelRestaurant.Api.Models
{
    public sealed record LoginRequest(string Email, string Password);
    public sealed record RegisterRequest(string Name, string Email, string Password, string ConfirmPassword);
    public sealed record LoginResponse(string Token, int ExpiresIn);
    public sealed record DashboardSummary(int ActiveBookings, decimal Revenue, int OccupancyRate, int PendingRequests);
}
