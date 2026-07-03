// File: HouseKeepingService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using System.IO;
using QRCoder;
using HotelRestaurant.Core.Entities.HouseKeeping; // NuGet Package: Install-Package QRCoder

namespace HotelRestaurant.Application.Services.Implementations
{
    public class HouseKeepingService : IHouseKeepingService
    {
        private readonly IUnitOfWork _uow;

        public HouseKeepingService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        // --- Room Cleaning ---
        public async Task<IEnumerable<RoomCleaningDto>> GetAllCleaningsAsync()
        {
            var data = await _uow.RoomCleanings.GetAllAsync();
            return data.Where(x => !x.IsDeleted).Select(x => new RoomCleaningDto
            {
                Id = x.Id,
                Name = x.Name,
                RoomNo = x.RoomNo,
                Date = x.Date,
                Status = x.Status
            }).ToList();
        }

        public async Task<bool> SaveCleaningAsync(RoomCleaningDto dto)
        {
            try
            {
                if (dto.Id > 0)
                {
                    var existing = await _uow.RoomCleanings.GetByIdAsync(dto.Id);
                    if (existing == null) return false;
                    existing.Name = dto.Name;
                    existing.RoomNo = dto.RoomNo;
                    existing.Date = dto.Date;
                    existing.Status = dto.Status;
                    _uow.RoomCleanings.Update(existing);
                }
                else
                {
                    await _uow.RoomCleanings.AddAsync(new RoomCleaning { Name = dto.Name, RoomNo = dto.RoomNo, Date = dto.Date, Status = dto.Status });
                }

                return await _uow.SaveChangesAsync() > 0;
            }
            catch (Exception ex)
            {
                // 🚀 This will print the precise database error in your Visual Studio / VS Code terminal
                Console.WriteLine("DB SAVE ERROR: " + ex.Message);
                if (ex.InnerException != null)
                {
                    Console.WriteLine("INNER EXCEPTION: " + ex.InnerException.Message);
                }
                throw; // rethrow so it still signals the 500 error during debugging
            }
        }
        public async Task<bool> DeleteCleaningAsync(int id)
        {
            var item = await _uow.RoomCleanings.GetByIdAsync(id);
            if (item == null) return false;
            item.IsDeleted = true;
            _uow.RoomCleanings.Update(item);
            return await _uow.SaveChangesAsync() > 0;
        }

        // --- Checklist ---
        public async Task<IEnumerable<ChecklistDto>> GetChecklistAsync()
        {
            var data = await _uow.HouseKeepingChecklists.GetAllAsync();
            return data.Where(x => !x.IsDeleted).Select(x => new ChecklistDto { Id = x.Id, TaskName = x.TaskName, Type = x.Type });
        }

        public async Task<bool> SaveChecklistAsync(ChecklistDto dto)
        {
            if (dto.Id > 0)
            {
                var target = await _uow.HouseKeepingChecklists.GetByIdAsync(dto.Id);
                if (target == null) return false;
                target.TaskName = dto.TaskName;
                target.Type = dto.Type;
                _uow.HouseKeepingChecklists.Update(target);
            }
            else
            {
                await _uow.HouseKeepingChecklists.AddAsync(new HouseKeepingChecklist { TaskName = dto.TaskName, Type = dto.Type });
            }
            return await _uow.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteChecklistAsync(int id)
        {
            var item = await _uow.HouseKeepingChecklists.GetByIdAsync(id);
            if (item == null) return false;
            item.IsDeleted = true;
            _uow.HouseKeepingChecklists.Update(item);
            return await _uow.SaveChangesAsync() > 0;
        }

        // --- Laundry Logs & Payments ---
        public async Task<IEnumerable<LaundryLogDto>> GetAllLaundryLogsAsync()
        {
            var logs = await _uow.LaundryLogs.GetAllAsync();
            return logs.Where(x => !x.IsDeleted).Select(x => new LaundryLogDto
            {
                Id = x.Id,
                InvoiceNo = x.InvoiceNo,
                LaundryName = x.LaundryName,
                ItemName = x.ItemName,
                OperateBy = x.OperateBy,
                TaskName = x.TaskName,
                ItemCost = x.ItemCost,
                Quantity = x.Quantity,
                Type = x.Type,
                SendDate = x.SendDate,
                ReceivedDate = x.ReceivedDate,
                PaymentStatus = x.PaymentStatus,
                Comments = x.Comments
            });
        }

        public async Task<bool> SaveLaundryLogAsync(LaundryLogDto dto)
        {
            if (dto.Id > 0)
            {
                var ex = await _uow.LaundryLogs.GetByIdAsync(dto.Id);
                if (ex == null) return false;
                ex.InvoiceNo = dto.InvoiceNo; ex.LaundryName = dto.LaundryName; ex.ItemName = dto.ItemName;
                ex.ItemCost = dto.ItemCost; ex.Quantity = dto.Quantity; ex.PaymentStatus = dto.PaymentStatus;
                _uow.LaundryLogs.Update(ex);
            }
            else
            {
                await _uow.LaundryLogs.AddAsync(new LaundryLog
                {
                    InvoiceNo = dto.InvoiceNo,
                    LaundryName = dto.LaundryName,
                    ItemName = dto.ItemName,
                    OperateBy = dto.OperateBy,
                    TaskName = dto.TaskName,
                    ItemCost = dto.ItemCost,
                    Quantity = dto.Quantity,
                    Type = dto.Type,
                    SendDate = dto.SendDate,
                    PaymentStatus = dto.PaymentStatus,
                    Comments = dto.Comments
                });
            }
            return await _uow.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<LaundryPaymentDto>> GetAllLaundryPaymentsAsync()
        {
            var data = await _uow.LaundryPayments.GetAllAsync();
            return data.Where(x => !x.IsDeleted).Select(x => new LaundryPaymentDto
            {
                Id = x.Id,
                Name = x.Name,
                InvoiceNo = x.InvoiceNo,
                LaundryName = x.LaundryName,
                TotalAmount = x.TotalAmount,
                DueAmount = x.DueAmount,
                PaidAmount = x.PaidAmount
            });
        }

        public async Task<bool> SaveLaundryPaymentAsync(LaundryPaymentDto dto)
        {
            if (dto.Id > 0)
            {
                var pay = await _uow.LaundryPayments.GetByIdAsync(dto.Id);
                if (pay == null) return false;
                pay.Name = dto.Name; pay.InvoiceNo = dto.InvoiceNo; pay.LaundryName = dto.LaundryName;
                pay.TotalAmount = dto.TotalAmount; pay.DueAmount = dto.DueAmount; pay.PaidAmount = dto.PaidAmount;
                _uow.LaundryPayments.Update(pay);
            }
            else
            {
                await _uow.LaundryPayments.AddAsync(new LaundryPayment
                {
                    Name = dto.Name,
                    InvoiceNo = dto.InvoiceNo,
                    LaundryName = dto.LaundryName,
                    TotalAmount = dto.TotalAmount,
                    DueAmount = dto.DueAmount,
                    PaidAmount = dto.PaidAmount
                });
            }
            return await _uow.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteLaundryPaymentAsync(int id)
        {
            var item = await _uow.LaundryPayments.GetByIdAsync(id);
            if (item == null) return false;
            item.IsDeleted = true;
            _uow.LaundryPayments.Update(item);
            return await _uow.SaveChangesAsync() > 0;
        }

        // --- 🚀 ENGINE: ROOM QR CODE GENERATION ---
        public byte[] GenerateRoomQrCode(string roomNo)
        {
            string payloadText = $"https://yourhotelapp.com/hk/room-status?roomNo={roomNo}";
            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            {
                using (QRCodeData qrCodeData = qrGenerator.CreateQrCode(payloadText, QRCodeGenerator.ECCLevel.Q))
                {
                    using (PngByteQRCode qrCode = new PngByteQRCode(qrCodeData))
                    {
                        return qrCode.GetGraphic(20); // PNG বাইট রিটার্ন করে যা ফ্রন্টএন্ডে সরাসরি রেন্ডার করা যাবে
                    }
                }
            }
        }
    }
}