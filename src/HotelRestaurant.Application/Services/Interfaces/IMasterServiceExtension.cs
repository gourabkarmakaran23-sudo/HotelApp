using System.Collections.Generic;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Master;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IMasterServiceExtension
    {
        // Tax Methods
        Task<List<TaxDto>> GetTaxesAsync();
        Task<int> CreateTaxAsync(TaxDto dto);
        Task<bool> UpdateTaxAsync(int id, TaxDto dto);
        Task<bool> DeleteTaxAsync(int id);

        // Promocode Methods
        Task<List<PromocodeDto>> GetPromocodesAsync();
        Task<int> CreatePromocodeAsync(PromocodeDto dto);
        Task<bool> UpdatePromocodeAsync(int id, PromocodeDto dto);
        Task<bool> DeletePromocodeAsync(int id);

        // Cancellation Policy Methods
        Task<List<CancellationPolicyDto>> GetCancellationPoliciesAsync();
        Task<int> CreateCancellationPolicyAsync(CancellationPolicyDto dto);
        Task<bool> UpdateCancellationPolicyAsync(int id, CancellationPolicyDto dto);
        Task<bool> DeleteCancellationPolicyAsync(int id);

        // Amenities Methods
        Task<List<AmenityDto>> GetAmenitiesAsync();
        Task<int> CreateAmenityAsync(AmenityDto dto);
        Task<bool> UpdateAmenityAsync(int id, AmenityDto dto);
        Task<bool> DeleteAmenityAsync(int id);
    }
}