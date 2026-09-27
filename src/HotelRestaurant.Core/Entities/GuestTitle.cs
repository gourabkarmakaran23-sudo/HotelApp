namespace HotelRestaurant.Core.Entities
{
    public class GuestTitle : BaseEntity
    {
        public string TitleName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}