using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HotelRestaurant.Application.DTOs.Master;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using Microsoft.Extensions.Logging;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class MasterService : IMasterService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<MasterService> _logger;

        public MasterService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<MasterService> logger)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        #region Currency Management
        public async Task<List<CurrencyDto>> GetCurrenciesAsync()
        {
            var currencies = await _unitOfWork.Currencies.GetAllAsync();
            return _mapper.Map<List<CurrencyDto>>(currencies.Where(x => !x.IsDeleted).ToList());
        }

        public async Task<CurrencyDto?> GetCurrencyByIdAsync(int id)
        {
            var currency = await _unitOfWork.Currencies.GetByIdAsync(id);
            if (currency == null || currency.IsDeleted) return null;
            return _mapper.Map<CurrencyDto>(currency);
        }

        public async Task<int> CreateCurrencyAsync(CurrencyDto dto)
        {
            var entity = new Currency
            {
                CurrencyName = dto.CurrencyName,
                CurrencyIcon = dto.CurrencyIcon,
                Position = dto.Position,
                ConversionRate = dto.ConversionRate,
                IsActive = dto.IsActive
            };

            await _unitOfWork.Currencies.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateCurrencyAsync(int id, CurrencyDto dto)
        {
            var entity = await _unitOfWork.Currencies.GetByIdAsync(id);
            if (entity == null) return false;

            entity.CurrencyName = dto.CurrencyName;
            entity.CurrencyIcon = dto.CurrencyIcon;
            entity.Position = dto.Position;
            entity.ConversionRate = dto.ConversionRate;
            entity.IsActive = dto.IsActive;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCurrencyAsync(int id)
        {
            var entity = await _unitOfWork.Currencies.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Payment Method
        public async Task<List<PaymentMethodDto>> GetPaymentMethodsAsync()
        {
            var paymentMethods = await _unitOfWork.PaymentMethods.GetAllAsync();
            return _mapper.Map<List<PaymentMethodDto>>(paymentMethods.Where(x => !x.IsDeleted).ToList());
        }

        public async Task<PaymentMethodDto?> GetPaymentMethodByIdAsync(int id)
        {
            var method = await _unitOfWork.PaymentMethods.GetByIdAsync(id);
            if (method == null || method.IsDeleted) return null;
            return _mapper.Map<PaymentMethodDto>(method);
        }

        public async Task<int> CreatePaymentMethodAsync(PaymentMethodDto dto)
        {
            var entity = new PaymentMethods
            {
                MethodName = dto.MethodName,
                IsActive = dto.IsActive
            };

            await _unitOfWork.PaymentMethods.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdatePaymentMethodAsync(int id, PaymentMethodDto dto)
        {
            var entity = await _unitOfWork.PaymentMethods.GetByIdAsync(id);
            if (entity == null) return false;

            entity.MethodName = dto.MethodName;
            entity.IsActive = dto.IsActive;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePaymentMethodAsync(int id)
        {
            var entity = await _unitOfWork.PaymentMethods.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Commission Agent
        public async Task<List<CommissionAgentDto>> GetCommissionAgentsAsync()
        {
            var commissionAgents = await _unitOfWork.CommissionAgents.GetAllAsync();
            return _mapper.Map<List<CommissionAgentDto>>(commissionAgents.Where(x => !x.IsDeleted).ToList());
        }

        public async Task<CommissionAgentDto?> GetCommissionAgentByIdAsync(int id)
        {
            var commissionAgent = await _unitOfWork.CommissionAgents.GetByIdAsync(id);
            if (commissionAgent == null || commissionAgent.IsDeleted) return null;
            return _mapper.Map<CommissionAgentDto>(commissionAgent);
        }

        public async Task<int> CreateCommissionAgentAsync(CommissionAgentDto dto)
        {
            var entity = new CommissionAgent
            {
                AgentName = dto.AgentName,
                Address = dto.Address,
                Mobile = dto.Mobile,
                Email = dto.Email,
                GSTIN = dto.GSTIN,
                IsActive = dto.IsActive
            };

            await _unitOfWork.CommissionAgents.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateCommissionAgentAsync(int id, CommissionAgentDto dto)
        {
            var entity = await _unitOfWork.CommissionAgents.GetByIdAsync(id);
            if (entity == null) return false;

            entity.AgentName = dto.AgentName;
            entity.Address = dto.Address;
            entity.Mobile = dto.Mobile;
            entity.Email = dto.Email;
            entity.GSTIN = dto.GSTIN;
            entity.IsActive = dto.IsActive;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCommissionAgentAsync(int id)
        {
            var entity = await _unitOfWork.CommissionAgents.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Agent Commission
        public async Task<List<AgentCommissionDto>> GetAgentCommissionsAsync()
        {
            var agentCommissions = await _unitOfWork.AgentCommissions.GetAllAsync();
            return _mapper.Map<List<AgentCommissionDto>>(agentCommissions.Where(x => !x.IsDeleted).ToList());
        }

        public async Task<AgentCommissionDto?> GetAgentCommissionByIdAsync(int id)
        {
            var agentCommission = await _unitOfWork.AgentCommissions.GetByIdAsync(id);
            if (agentCommission == null || agentCommission.IsDeleted) return null;
            return _mapper.Map<AgentCommissionDto>(agentCommission);
        }

        public async Task<int> CreateAgentCommissionAsync(AgentCommissionDto dto)
        {
            int bookingId = 0;
            if (!string.IsNullOrEmpty(dto.BookingNumber))
            {
                var bookings = await _unitOfWork.Bookings.FindAsync(b => b.BookingNumber == dto.BookingNumber);
                var booking = bookings.FirstOrDefault();
                if (booking != null) bookingId = booking.Id;
            }

            var entity = new AgentCommission
            {
                BookingId = bookingId,
                CommissionAgentId = dto.CommissionAgentId,
                CommissionPercentage = dto.CommissionPercentage,
                CommissionAmount = dto.CommissionAmount,
                PaymentStatus = dto.PaymentStatus,
                PaidDate = dto.PaidDate
            };

            await _unitOfWork.AgentCommissions.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateAgentCommissionAsync(int id, AgentCommissionDto dto)
        {
            var entity = await _unitOfWork.AgentCommissions.GetByIdAsync(id);
            if (entity == null) return false;

            if (!string.IsNullOrEmpty(dto.BookingNumber))
            {
                var bookings = await _unitOfWork.Bookings.FindAsync(b => b.BookingNumber == dto.BookingNumber);
                var booking = bookings.FirstOrDefault();
                if (booking != null) entity.BookingId = booking.Id;
            }

            entity.CommissionAgentId = dto.CommissionAgentId;
            entity.CommissionPercentage = dto.CommissionPercentage;
            entity.CommissionAmount = dto.CommissionAmount;
            entity.PaymentStatus = dto.PaymentStatus;
            entity.PaidDate = dto.PaidDate;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAgentCommissionAsync(int id)
        {
            var entity = await _unitOfWork.AgentCommissions.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Financial Year Management (Required by IMasterService)
        public async Task<List<FinancialYearDto>> GetFinancialYearsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<FinancialYearDto?> GetFinancialYearByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<int> CreateFinancialYearAsync(FinancialYearDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateFinancialYearAsync(int id, FinancialYearDto dto)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteFinancialYearAsync(int id)
        {
            throw new NotImplementedException();
        }
        #endregion
    }
}