// File: IHouseKeepingService.cs
using System.Collections.Generic;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs;

namespace HotelRestaurant.Application.Services.Interfaces
{
    public interface IHouseKeepingService
    {
        // Room Cleaning
        Task<IEnumerable<RoomCleaningDto>> GetAllCleaningsAsync();
        Task<bool> SaveCleaningAsync(RoomCleaningDto dto);
        Task<bool> DeleteCleaningAsync(int id);

        // Checklist
        Task<IEnumerable<ChecklistDto>> GetChecklistAsync();
        Task<bool> SaveChecklistAsync(ChecklistDto dto);
        Task<bool> DeleteChecklistAsync(int id);

        // Laundry Master Logs
        Task<IEnumerable<LaundryLogDto>> GetAllLaundryLogsAsync();
        Task<bool> SaveLaundryLogAsync(LaundryLogDto dto);

        // Laundry Payments
        Task<IEnumerable<LaundryPaymentDto>> GetAllLaundryPaymentsAsync();
        Task<bool> SaveLaundryPaymentAsync(LaundryPaymentDto dto);
        Task<bool> DeleteLaundryPaymentAsync(int id);
        
        // QR Code Engine
        byte[] GenerateRoomQrCode(string roomNo);
    }
}