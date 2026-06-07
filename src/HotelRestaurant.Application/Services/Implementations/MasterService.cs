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
                CommissionRate = dto.CommissionRate,
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
            entity.CommissionRate = dto.CommissionRate;
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

        #region Financial Year Management
        public async Task<List<FinancialYearDto>> GetFinancialYearsAsync()
        {
            var items = await _unitOfWork.FinancialYears.GetAllAsync();
            return _mapper.Map<List<FinancialYearDto>>(items.Where(x => !x.IsDeleted).ToList());
        }

        public async Task<FinancialYearDto?> GetFinancialYearByIdAsync(int id)
        {
            var entity = await _unitOfWork.FinancialYears.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return null;
            return _mapper.Map<FinancialYearDto>(entity);
        }

        public async Task<int> CreateFinancialYearAsync(FinancialYearDto dto)
        {
            var entity = new FinancialYear
            {
                Title = dto.Title,
                FromDate = dto.FromDate,
                ToDate = dto.ToDate,
                IsActive = dto.IsActive
            };

            await _unitOfWork.FinancialYears.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateFinancialYearAsync(int id, FinancialYearDto dto)
        {
            var entity = await _unitOfWork.FinancialYears.GetByIdAsync(id);
            if (entity == null) return false;

            entity.Title = dto.Title;
            entity.FromDate = dto.FromDate;
            entity.ToDate = dto.ToDate;
            entity.IsActive = dto.IsActive;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteFinancialYearAsync(int id)
        {
            var entity = await _unitOfWork.FinancialYears.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Wake Up Call List Management
        public async Task<List<WakeUpCallDto>> GetWakeUpCallsAsync()
        {
            var items = await _unitOfWork.WakeUpCalls.GetAllAsync();
            return _mapper.Map<List<WakeUpCallDto>>(items.Where(x => !x.IsDeleted).ToList());
        }

        public async Task<WakeUpCallDto?> GetWakeUpCallByIdAsync(int id)
        {
            var entity = await _unitOfWork.WakeUpCalls.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return null;
            return _mapper.Map<WakeUpCallDto>(entity);
        }

        public async Task<int> CreateWakeUpCallAsync(WakeUpCallDto dto)
        {
            var entity = new WakeUpCall
            {
                RoomNumber = dto.RoomNumber,
                GuestName = dto.GuestName,
                CallDateTime = dto.CallDateTime,
                Remarks = dto.Remarks,
                Status = dto.Status ?? "Pending"
            };

            await _unitOfWork.WakeUpCalls.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdateWakeUpCallAsync(int id, WakeUpCallDto dto)
        {
            var entity = await _unitOfWork.WakeUpCalls.GetByIdAsync(id);
            if (entity == null) return false;

            entity.RoomNumber = dto.RoomNumber;
            entity.GuestName = dto.GuestName;
            entity.CallDateTime = dto.CallDateTime;
            entity.Remarks = dto.Remarks;
            entity.Status = dto.Status ?? "Pending";

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteWakeUpCallAsync(int id)
        {
            var entity = await _unitOfWork.WakeUpCalls.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Purchase Item Management

        public async Task<List<PurchaseItemDto>> GetPurchaseItemsAsync()
        {
            var items = await _unitOfWork.PurchaseItems.GetAllAsync();
            return _mapper.Map<List<PurchaseItemDto>>(items.Where(x => !x.IsDeleted).OrderByDescending(x => x.PurchaseDate).ToList());
        }

        public async Task<PurchaseItemDto?> GetPurchaseItemByIdAsync(int id)
        {
            var item = await _unitOfWork.PurchaseItems.GetByIdAsync(id);
            if (item == null || item.IsDeleted) return null;
            return _mapper.Map<PurchaseItemDto>(item);
        }

        public async Task<int> CreatePurchaseItemAsync(PurchaseItemDto dto)
        {
            var entity = _mapper.Map<PurchaseItem>(dto);
            entity.TotalAmount = dto.Quantity * dto.Rate;
            await _unitOfWork.PurchaseItems.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdatePurchaseItemAsync(int id, PurchaseItemDto dto)
        {
            var entity = await _unitOfWork.PurchaseItems.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return false;

            _mapper.Map(dto, entity);
            entity.TotalAmount = dto.Quantity * dto.Rate;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePurchaseItemAsync(int id)
        {
            var entity = await _unitOfWork.PurchaseItems.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Purchase Return Management

        public async Task<List<PurchaseReturnDto>> GetPurchaseReturnsAsync()
        {
            var items = await _unitOfWork.PurchaseReturns.GetAllAsync();
            return _mapper.Map<List<PurchaseReturnDto>>(items.Where(x => !x.IsDeleted).OrderByDescending(x => x.ReturnDate).ToList());
        }

        public async Task<PurchaseReturnDto?> GetPurchaseReturnByIdAsync(int id)
        {
            var item = await _unitOfWork.PurchaseReturns.GetByIdAsync(id);
            if (item == null || item.IsDeleted) return null;
            return _mapper.Map<PurchaseReturnDto>(item);
        }

        public async Task<int> CreatePurchaseReturnAsync(PurchaseReturnDto dto)
        {
            var entity = _mapper.Map<PurchaseReturn>(dto);
            entity.TotalRefundAmount = dto.ReturnQuantity * dto.RefundRate;
            await _unitOfWork.PurchaseReturns.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<bool> UpdatePurchaseReturnAsync(int id, PurchaseReturnDto dto)
        {
            var entity = await _unitOfWork.PurchaseReturns.GetByIdAsync(id);
            if (entity == null || entity.IsDeleted) return false;

            _mapper.Map(dto, entity);
            entity.TotalRefundAmount = dto.ReturnQuantity * dto.RefundRate;

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePurchaseReturnAsync(int id)
        {
            var entity = await _unitOfWork.PurchaseReturns.GetByIdAsync(id);
            if (entity == null) return false;

            entity.IsDeleted = true;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Stock Report & Ledger Operations

        public async Task<List<StockReportDto>> GetCurrentProductStockReportAsync()
        {
            var purchases = await _unitOfWork.PurchaseItems.GetAllAsync();
            var activePurchases = purchases.Where(x => !x.IsDeleted).ToList();

            var returns = await _unitOfWork.PurchaseReturns.GetAllAsync();
            var activeReturns = returns.Where(x => !x.IsDeleted).ToList();

            // Grouping by unique Item Names to calculate aggregate stock levels
            var distinctItemNames = activePurchases.Select(x => x.ItemName).Distinct();
            var reportList = new List<StockReportDto>();

            foreach (var name in distinctItemNames)
            {
                var itemPurchases = activePurchases.Where(x => x.ItemName == name).ToList();
                var itemReturns = activeReturns.Where(x => x.ItemName == name).ToList();

                decimal totalPurchased = itemPurchases.Sum(x => x.Quantity);
                decimal totalReturned = itemReturns.Sum(x => x.ReturnQuantity);
                decimal currentStock = totalPurchased - totalReturned;

                string unit = itemPurchases.FirstOrDefault()?.Unit ?? "Pcs";
                decimal avgRate = itemPurchases.Count > 0 ? itemPurchases.Average(x => x.Rate) : 0;
                decimal totalStockValue = currentStock * avgRate;

                string status = "In Stock";
                if (currentStock <= 0) status = "Out of Stock";
                else if (currentStock < 15) status = "Low Stock"; // Configurable warning threshold

                reportList.Add(new StockReportDto
                {
                    ItemName = name,
                    TotalPurchased = totalPurchased,
                    TotalReturned = totalReturned,
                    CurrentStock = currentStock,
                    Unit = unit,
                    AverageRate = Math.Round(avgRate, 2),
                    TotalStockValue = Math.Round(totalStockValue, 2),
                    Status = status
                });
            }

            return reportList.OrderBy(x => x.CurrentStock).ToList();
        }

        public async Task<List<StockLedgerDetailDto>> GetStockLedgerDetailsByItemAsync(string itemName)
        {
            var ledgerList = new List<StockLedgerDetailDto>();

            var purchases = await _unitOfWork.PurchaseItems.GetAllAsync();
            var itemPurchases = purchases.Where(x => !x.IsDeleted && x.ItemName.ToLower() == itemName.ToLower());

            foreach (var p in itemPurchases)
            {
                ledgerList.Add(new StockLedgerDetailDto
                {
                    TransactionDate = p.PurchaseDate,
                    TransactionType = "Purchase",
                    ReferenceNo = p.InvoiceNumber,
                    SupplierName = p.SupplierName,
                    Quantity = p.Quantity,
                    Unit = p.Unit,
                    Rate = p.Rate,
                    TotalAmount = p.TotalAmount
                });
            }

            var returns = await _unitOfWork.PurchaseReturns.GetAllAsync();
            var itemReturns = returns.Where(x => !x.IsDeleted && x.ItemName.ToLower() == itemName.ToLower());

            foreach (var r in itemReturns)
            {
                ledgerList.Add(new StockLedgerDetailDto
                {
                    TransactionDate = r.ReturnDate,
                    TransactionType = "Return",
                    ReferenceNo = r.ReferenceInvoiceNo,
                    SupplierName = r.SupplierName,
                    Quantity = r.ReturnQuantity,
                    Unit = r.Unit,
                    Rate = r.RefundRate,
                    TotalAmount = r.TotalRefundAmount
                });
            }

            return ledgerList.OrderByDescending(x => x.TransactionDate).ToList();
        }

        #endregion
    }
}