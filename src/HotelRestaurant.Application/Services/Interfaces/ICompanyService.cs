namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface ICompanyService
    {
        Task<IEnumerable<HotelRestaurant.Application.DTOs.CompanyLookupDto>> GetLookupAsync();
        Task<IEnumerable<HotelRestaurant.Application.DTOs.CompanyDto>> GetAllAsync();
        Task<HotelRestaurant.Application.DTOs.CompanyDto?> GetByIdAsync(int id);
        Task<HotelRestaurant.Application.DTOs.CompanyDto> CreateAsync(HotelRestaurant.Application.DTOs.CreateCompanyDto dto);
    }
}
