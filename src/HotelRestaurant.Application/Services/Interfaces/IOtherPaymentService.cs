using System.Collections.Generic;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.OtherPayment;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IOtherPaymentService
    {
        Task<List<OtherPaymentInvoiceDto>> GetAllInvoicesAsync();
        Task<OtherPaymentInvoiceDto?> GetInvoiceByIdAsync(int id);
        Task<int> CreateInvoiceAsync(OtherPaymentInvoiceDto dto);
        Task<bool> DeleteInvoiceAsync(int id);
    }
}