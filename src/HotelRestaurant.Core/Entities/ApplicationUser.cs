using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Core.Entities
{
    public class ApplicationUser : BaseEntity, IMultiHotelEntity, IMultiCompanyEntity
    {
        public int HotelId { get; set; } // Tracks which hotel owns this booking transaction
        public int CompanyId { get; set; }
        public Hotel? Hotel { get; set; }
        public Company? Company { get; set; }
        public string UserName { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public bool IsActive { get; set; } = true;

    }
}
