namespace HotelRestaurant.Core.Interfaces
{
    // For entities belonging explicitly to a distinct Hotel branch
    public interface IMultiHotelEntity
    {
        int HotelId { get; set; }
    }

    // For entities that cross-reference back to the corporate entity structure
    public interface IMultiCompanyEntity
    {
        int CompanyId { get; set; }
    }
}