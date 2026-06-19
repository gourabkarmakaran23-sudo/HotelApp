using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Account;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AccountService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<OpeningBalanceDto>> GetOpeningBalancesAsync()
        {
            var balances = await _unitOfWork.OpeningBalances.GetAllAsync();
            if (balances == null) return new List<OpeningBalanceDto>();

            return balances
                .Where(x => x != null && !x.IsDeleted)
                .Select(x => new OpeningBalanceDto
                {
                    Id = x.Id,
                    AccountName = x.AccountName,
                    AccountType = x.AccountType,
                    Amount = x.Amount,
                    BalanceType = x.BalanceType,
                    Date = x.Date,
                    Remarks = x.Remarks,
                    IsActive = x.IsActive
                })
                .ToList();
        }

        public async Task<OpeningBalanceDto?> GetOpeningBalanceByIdAsync(int id)
        {
            var x = await _unitOfWork.OpeningBalances.GetByIdAsync(id);
            if (x == null || x.IsDeleted) return null;

            return new OpeningBalanceDto
            {
                Id = x.Id,
                AccountName = x.AccountName,
                AccountType = x.AccountType,
                Amount = x.Amount,
                BalanceType = x.BalanceType,
                Date = x.Date,
                Remarks = x.Remarks,
                IsActive = x.IsActive
            };
        }

        public async Task<int> CreateOpeningBalanceAsync(OpeningBalanceDto dto)
        {
            var entity = new OpeningBalance
            {
                AccountName = dto.AccountName,
                AccountType = dto.AccountType,
                Amount = dto.Amount,
                BalanceType = dto.BalanceType,
                Date = dto.Date,
                Remarks = dto.Remarks,
                IsActive = dto.IsActive,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.OpeningBalances.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateOpeningBalanceAsync(int id, OpeningBalanceDto dto)
        {
            var entity = await _unitOfWork.OpeningBalances.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return false;

            entity.AccountName = dto.AccountName;
            entity.AccountType = dto.AccountType;
            entity.Amount = dto.Amount;
            entity.BalanceType = dto.BalanceType;
            entity.Date = dto.Date;
            entity.Remarks = dto.Remarks;
            entity.IsActive = dto.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOpeningBalanceAsync(int id)
        {
            var entity = await _unitOfWork.OpeningBalances.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            entity.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}