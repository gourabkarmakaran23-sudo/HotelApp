namespace HotelRestaurant.Core.Entities
{
    public class BookingReferenceOption : BaseEntity
    {
        public string ReferenceName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }
}