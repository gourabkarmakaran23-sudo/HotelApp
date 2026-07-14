using HotelRestaurant.Application.DTOs.RefundRecord;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class RefundService : IRefundService
    {
        private readonly IUnitOfWork _unitOfWork;

        public RefundService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<RefundRecordDto>> GetRefundsByStatusAsync(RefundStatus status)
        {
            var all = await _unitOfWork.RefundRecords.GetAllAsync();
            return all.Where(x => x.Status == status && !x.IsDeleted)
                      .Select(x => MapToDto(x))
                      .ToList();
        }

        public async Task<RefundRecordDto?> GetRefundByIdAsync(int id)
        {
            var x = await _unitOfWork.RefundRecords.GetByIdAsync(id);
            if (x == null || x.IsDeleted) return null;
            return MapToDto(x);
        }

        public async Task<RefundRecordDto> SaveRefundRecordAsync(UpsertRefundRecordDto dto)
        {
            RefundRecord entity;

            if (dto.Id > 0)
            {
                entity = await _unitOfWork.RefundRecords.GetByIdAsync(dto.Id) 
                         ?? new RefundRecord();
            }
            else
            {
                entity = new RefundRecord();
            }

            entity.BookingId = dto.BookingId;
            entity.GuestName = dto.GuestName;
            entity.RefundAmount = dto.RefundAmount;
            entity.Status = dto.Status;
            
            // Map Conditional Stages
            entity.BookingSource = dto.BookingSource;
            entity.RequestDate = dto.RequestDate;
            entity.Remarks = dto.Remarks;
            entity.BankName = dto.BankName;
            entity.AccountNo = dto.AccountNo;
            entity.IfscCode = dto.IfscCode;
            entity.ProcessStatus = dto.ProcessStatus;
            entity.RefundChannel = dto.RefundChannel;
            entity.TransactionId = dto.TransactionId;
            entity.RefundedDate = dto.RefundedDate;
            entity.AttachmentName = dto.AttachmentName;

            if (dto.Id > 0)
                _unitOfWork.RefundRecords.Update(entity);
            else
                await _unitOfWork.RefundRecords.AddAsync(entity);

            await _unitOfWork.SaveChangesAsync();
            return MapToDto(entity);
        }

        public async Task<bool> UpdateRefundStatusAsync(int id, RefundStatus newStatus)
        {
            var x = await _unitOfWork.RefundRecords.GetByIdAsync(id);
            if (x == null || x.IsDeleted) return false;

            x.Status = newStatus;
            _unitOfWork.RefundRecords.Update(x);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteRefundAsync(int id)
        {
            var x = await _unitOfWork.RefundRecords.GetByIdAsync(id);
            if (x == null) return false;

            x.IsDeleted = true;
            _unitOfWork.RefundRecords.Update(x);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private static RefundRecordDto MapToDto(RefundRecord x) => new RefundRecordDto
        {
            Id = x.Id,
            BookingId = x.BookingId,
            GuestName = x.GuestName,
            RefundAmount = x.RefundAmount,
            Status = x.Status,
            BookingSource = x.BookingSource,
            RequestDate = x.RequestDate,
            Remarks = x.Remarks,
            BankName = x.BankName,
            AccountNo = x.AccountNo,
            IfscCode = x.IfscCode,
            ProcessStatus = x.ProcessStatus,
            RefundChannel = x.RefundChannel,
            TransactionId = x.TransactionId,
            RefundedDate = x.RefundedDate,
            AttachmentName = x.AttachmentName
        };
    }
}