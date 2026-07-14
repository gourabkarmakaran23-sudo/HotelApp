using System.Collections.Generic;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Account;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IAccountService
    {
        Task<List<OpeningBalanceDto>> GetOpeningBalancesAsync();
        Task<OpeningBalanceDto?> GetOpeningBalanceByIdAsync(int id);
        Task<int> CreateOpeningBalanceAsync(OpeningBalanceDto dto);
        Task<bool> UpdateOpeningBalanceAsync(int id, OpeningBalanceDto dto);
        Task<bool> DeleteOpeningBalanceAsync(int id);
    }
}