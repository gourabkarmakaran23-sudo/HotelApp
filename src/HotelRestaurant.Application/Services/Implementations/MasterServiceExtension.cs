using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.Master;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class MasterServiceExtension : IMasterServiceExtension
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterServiceExtension(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        #region Tax Management
        public async Task<List<TaxDto>> GetTaxesAsync()
        {
            var data = await _unitOfWork.Taxes.GetAllAsync();
            return data.Where(x => !x.IsDeleted).Select(x => new TaxDto {
                Id = x.Id, TaxName = x.TaxName, TaxRate = x.TaxRate, TaxCode = x.TaxCode, IsActive = x.IsActive
            }).ToList();
        }

        public async Task<int> CreateTaxAsync(TaxDto dto)
        {
            var entity = new Tax { TaxName = dto.TaxName, TaxRate = dto.TaxRate, TaxCode = dto.TaxCode, IsActive = dto.IsActive };
            await _unitOfWork.Taxes.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateTaxAsync(int id, TaxDto dto)
        {
            var entity = await _unitOfWork.Taxes.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return false;
            entity.TaxName = dto.TaxName; entity.TaxRate = dto.TaxRate; entity.TaxCode = dto.TaxCode; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(); return true;
        }

        public async Task<bool> DeleteTaxAsync(int id)
        {
            var entity = await _unitOfWork.Taxes.GetByIdAsync(id);
            if (entity == null) return false;
            entity.IsDeleted = true; entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(); return true;
        }
        #endregion

        #region Promocode Management
        public async Task<List<PromocodeDto>> GetPromocodesAsync()
        {
            var data = await _unitOfWork.Promocodes.GetAllAsync();
            return data.Where(x => !x.IsDeleted).Select(x => new PromocodeDto {
                Id = x.Id, Code = x.Code, DiscountType = x.DiscountType, DiscountValue = x.DiscountValue,
                MinimumBookingAmount = x.MinimumBookingAmount, StartDate = x.StartDate, EndDate = x.EndDate, MaxUses = x.MaxUses, IsActive = x.IsActive
            }).ToList();
        }

        public async Task<int> CreatePromocodeAsync(PromocodeDto dto)
        {
            var entity = new Promocode { 
                Code = dto.Code, DiscountType = dto.DiscountType, DiscountValue = dto.DiscountValue,
                MinimumBookingAmount = dto.MinimumBookingAmount, StartDate = dto.StartDate, EndDate = dto.EndDate, MaxUses = dto.MaxUses, IsActive = dto.IsActive 
            };
            await _unitOfWork.Promocodes.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdatePromocodeAsync(int id, PromocodeDto dto)
        {
            var entity = await _unitOfWork.Promocodes.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return false;
            entity.Code = dto.Code; entity.DiscountType = dto.DiscountType; entity.DiscountValue = dto.DiscountValue;
            entity.MinimumBookingAmount = dto.MinimumBookingAmount; entity.StartDate = dto.StartDate; entity.EndDate = dto.EndDate;
            entity.MaxUses = dto.MaxUses; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(); return true;
        }

        public async Task<bool> DeletePromocodeAsync(int id)
        {
            var entity = await _unitOfWork.Promocodes.GetByIdAsync(id);
            if (entity == null) return false;
            entity.IsDeleted = true; entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(); return true;
        }
        #endregion

        #region Cancellation Policy
        public async Task<List<CancellationPolicyDto>> GetCancellationPoliciesAsync()
        {
            var data = await _unitOfWork.CancellationPolicies.GetAllAsync();
            return data.Where(x => !x.IsDeleted).Select(x => new CancellationPolicyDto {
                Id = x.Id, PolicyName = x.PolicyName, CancellationWindowHours = x.CancellationWindowHours, ChargePercentage = x.ChargePercentage, Description = x.Description, IsActive = x.IsActive
            }).ToList();
        }

        public async Task<int> CreateCancellationPolicyAsync(CancellationPolicyDto dto)
        {
            var entity = new CancellationPolicy { PolicyName = dto.PolicyName, CancellationWindowHours = dto.CancellationWindowHours, ChargePercentage = dto.ChargePercentage, Description = dto.Description, IsActive = dto.IsActive };
            await _unitOfWork.CancellationPolicies.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateCancellationPolicyAsync(int id, CancellationPolicyDto dto)
        {
            var entity = await _unitOfWork.CancellationPolicies.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return false;
            entity.PolicyName = dto.PolicyName; entity.CancellationWindowHours = dto.CancellationWindowHours; entity.ChargePercentage = dto.ChargePercentage; entity.Description = dto.Description; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(); return true;
        }

        public async Task<bool> DeleteCancellationPolicyAsync(int id)
        {
            var entity = await _unitOfWork.CancellationPolicies.GetByIdAsync(id);
            if (entity == null) return false;
            entity.IsDeleted = true; entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(); return true;
        }
        #endregion

        #region Amenities Management
        public async Task<List<AmenityDto>> GetAmenitiesAsync()
        {
            var data = await _unitOfWork.Amenities.GetAllAsync();
            return data.Where(x => !x.IsDeleted).Select(x => new AmenityDto {
                Id = x.Id, AmenityName = x.AmenityName, IconClass = x.IconClass, Description = x.Description, IsActive = x.IsActive
            }).ToList();
        }

        public async Task<int> CreateAmenityAsync(AmenityDto dto)
        {
            var entity = new Amenity { AmenityName = dto.AmenityName, IconClass = dto.IconClass, Description = dto.Description, IsActive = dto.IsActive };
            await _unitOfWork.Amenities.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateAmenityAsync(int id, AmenityDto dto)
        {
            var entity = await _unitOfWork.Amenities.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return false;
            entity.AmenityName = dto.AmenityName; entity.IconClass = dto.IconClass; entity.Description = dto.Description; entity.IsActive = dto.IsActive; entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(); return true;
        }

        public async Task<bool> DeleteAmenityAsync(int id)
        {
            var entity = await _unitOfWork.Amenities.GetByIdAsync(id);
            if (entity == null) return false;
            entity.IsDeleted = true; entity.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync(); return true;
        }
        #endregion
    }
}