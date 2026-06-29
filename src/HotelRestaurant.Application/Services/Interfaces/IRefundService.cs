
using HotelRestaurant.Application.DTOs.RefundRecord;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IRefundService
    {
        Task<IEnumerable<RefundRecordDto>> GetRefundsByStatusAsync(RefundStatus status);
        Task<RefundRecordDto?> GetRefundByIdAsync(int id);
        Task<RefundRecordDto> SaveRefundRecordAsync(UpsertRefundRecordDto dto);
        Task<bool> UpdateRefundStatusAsync(int id, RefundStatus newStatus);
        Task<bool> DeleteRefundAsync(int id);
    }
}