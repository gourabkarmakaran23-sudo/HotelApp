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

        #region Wake Up Call    
        Task<List<WakeUpCallDto>> GetWakeUpCallsAsync();
        Task<WakeUpCallDto?> GetWakeUpCallByIdAsync(int id);
        Task<int> CreateWakeUpCallAsync(WakeUpCallDto dto);

        Task<bool> UpdateWakeUpCallAsync(int id, WakeUpCallDto dto);
        Task<bool> DeleteWakeUpCallAsync(int id);
        #endregion

        // Purchase Items
        Task<List<PurchaseItemDto>> GetPurchaseItemsAsync();
        Task<PurchaseItemDto?> GetPurchaseItemByIdAsync(int id);
        Task<int> CreatePurchaseItemAsync(PurchaseItemDto dto);
        Task<bool> UpdatePurchaseItemAsync(int id, PurchaseItemDto dto);
        Task<bool> DeletePurchaseItemAsync(int id);

        // Purchase Returns
        Task<List<PurchaseReturnDto>> GetPurchaseReturnsAsync();
        Task<PurchaseReturnDto?> GetPurchaseReturnByIdAsync(int id);
        Task<int> CreatePurchaseReturnAsync(PurchaseReturnDto dto);
        Task<bool> UpdatePurchaseReturnAsync(int id, PurchaseReturnDto dto);
        Task<bool> DeletePurchaseReturnAsync(int id);

        Task<List<StockReportDto>> GetCurrentProductStockReportAsync();
        Task<List<StockLedgerDetailDto>> GetStockLedgerDetailsByItemAsync(string itemName);



    }
}