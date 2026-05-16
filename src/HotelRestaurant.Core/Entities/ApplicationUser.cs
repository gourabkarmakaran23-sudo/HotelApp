namespace HotelRestaurant.Core.Entities
{
    public class ApplicationUser : BaseEntity
    {
        public string UserName { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public bool   IsActive { get; set; } = true;

    }
}
