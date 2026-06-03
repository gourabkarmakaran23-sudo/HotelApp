using System.Collections.Generic;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Master;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IMasterService
    {
        #region Currency
        Task<List<CurrencyDto>> GetCurrenciesAsync();
        Task<CurrencyDto?> GetCurrencyByIdAsync(int id);
        Task<int> CreateCurrencyAsync(CurrencyDto dto);
        Task<bool> UpdateCurrencyAsync(int id, CurrencyDto dto);
        Task<bool> DeleteCurrencyAsync(int id);
        #endregion

        #region Payment Method
        Task<List<PaymentMethodDto>> GetPaymentMethodsAsync();
        Task<PaymentMethodDto?> GetPaymentMethodByIdAsync(int id);
        Task<int> CreatePaymentMethodAsync(PaymentMethodDto dto);
        Task<bool> UpdatePaymentMethodAsync(int id, PaymentMethodDto dto);
        Task<bool> DeletePaymentMethodAsync(int id);
        #endregion

        #region Commission Agent
        Task<List<CommissionAgentDto>> GetCommissionAgentsAsync();
        Task<CommissionAgentDto?> GetCommissionAgentByIdAsync(int id);
        Task<int> CreateCommissionAgentAsync(CommissionAgentDto dto);
        Task<bool> UpdateCommissionAgentAsync(int id, CommissionAgentDto dto);
        Task<bool> DeleteCommissionAgentAsync(int id);
        #endregion

        #region Agent Commission
        Task<List<AgentCommissionDto>> GetAgentCommissionsAsync();
        Task<AgentCommissionDto?> GetAgentCommissionByIdAsync(int id);
        Task<int> CreateAgentCommissionAsync(AgentCommissionDto dto);
        Task<bool> UpdateAgentCommissionAsync(int id, AgentCommissionDto dto);
        Task<bool> DeleteAgentCommissionAsync(int id);
        #endregion

        #region Financial Year
        Task<List<FinancialYearDto>> GetFinancialYearsAsync();
        Task<FinancialYearDto?> GetFinancialYearByIdAsync(int id);
        Task<int> CreateFinancialYearAsync(FinancialYearDto dto);
        Task<bool> UpdateFinancialYearAsync(int id, FinancialYearDto dto);
        Task<bool> DeleteFinancialYearAsync(int id);
        #endregion
    }
}