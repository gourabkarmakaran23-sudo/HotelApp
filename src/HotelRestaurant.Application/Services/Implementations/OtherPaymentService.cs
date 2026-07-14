using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Application.DTOs.OtherPayment;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Application.Services.Implementations
{
    public class OtherPaymentService : IOtherPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;

        public OtherPaymentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<OtherPaymentInvoiceDto>> GetAllInvoicesAsync()
        {
            // Manual Mapping to avoid Automapper dependencies for sub-collections
            var invoices = await _unitOfWork.OtherPaymentInvoices.GetAllAsync();
            var activeInvoices = invoices.Where(x => !x.IsDeleted).ToList();

            return activeInvoices.Select(x => new OtherPaymentInvoiceDto
            {
                Id = x.Id,
                InvoiceNo = x.InvoiceNo,
                InvoiceDate = x.InvoiceDate,
                CustomerName = x.CustomerName,
                Mobile = x.Mobile,
                CustomerAddress = x.CustomerAddress,
                Gstin = x.Gstin,
                Remarks = x.Remarks,
                AttachmentName = x.AttachmentName,
                SubTotalSummary = x.SubTotalSummary,
                TotalGstSummary = x.TotalGstSummary,
                Adjustment = x.Adjustment,
                RoundOff = x.RoundOff,
                InvoiceAmount = x.InvoiceAmount,
                PaidAmount = x.PaidAmount,
                DueAmount = x.DueAmount
            }).ToList();
        }

        public async Task<OtherPaymentInvoiceDto?> GetInvoiceByIdAsync(int id)
        {
            // ১. প্রথমে মাস্টার টেবিল থেকে ইনভয়েস মেইন ডাটা তোলা হলো
            var x = await _unitOfWork.OtherPaymentInvoices.GetByIdAsync(id);
            if (x == null || x.IsDeleted) return null;

            // ২. 🎯 এবার চাইল্ড টেবিল থেকে এই ইনভয়েস আইডির আন্ডারে যতগুলো আইটেম আছে সব কুয়েরি করা হলো
            // (নোট: আপনার জেনেরিক রিপোজিটরিতে যদি GetAllAsync বা FindAsync থাকে, সেটি ব্যবহার করবেন)
            var allItems = await _unitOfWork.OtherPaymentInvoiceItems.GetAllAsync();
            var invoiceItems = allItems.Where(item => item.OtherPaymentInvoiceId == id).ToList();
            // 💡 (যদি আপনার মডেলে ফরেন কি-র নাম 'InvoiceId' বা অন্য কিছু হয়, সেটি OtherPaymentInvoiceId এর জায়গায় বসাবেন)

            // ৩. DTO ম্যাপ করে রিটার্ন করা
            return new OtherPaymentInvoiceDto
            {
                Id = x.Id,
                InvoiceNo = x.InvoiceNo,
                InvoiceDate = x.InvoiceDate,
                CustomerName = x.CustomerName,
                Mobile = x.Mobile,
                CustomerAddress = x.CustomerAddress,
                Gstin = x.Gstin,
                Remarks = x.Remarks,
                AttachmentName = x.AttachmentName,
                InvoiceAmount = x.InvoiceAmount,

                // 🎯 চাইল্ড আইটেম ডাটা ম্যাপ করে ফ্রন্টএন্ডের জন্য পাঠানো হলো
                Items = invoiceItems.Select(item => new OtherPaymentInvoiceItemDto
                {
                    Id = item.Id,
                    Type = item.Type,
                    Hsn = item.Hsn,
                    Description = item.Description,
                    Unit = item.Unit,
                    Rate = item.Rate,
                    Qty = item.Qty,
                    SubTotal = item.SubTotal,
                    GstRate = item.GstRate,
                    GstType = item.GstType,
                    GstAmount = item.GstAmount,
                    Total = item.Total
                }).ToList()
            };
        }
        public async Task<int> CreateInvoiceAsync(OtherPaymentInvoiceDto dto)
        {
            var masterEntity = new OtherPaymentInvoice
            {
                InvoiceNo = dto.InvoiceNo,
                InvoiceDate = dto.InvoiceDate,
                CustomerName = dto.CustomerName,
                Mobile = dto.Mobile,
                CustomerAddress = dto.CustomerAddress,
                Gstin = dto.Gstin,
                Remarks = dto.Remarks,
                AttachmentName = dto.AttachmentName,
                SubTotalSummary = dto.SubTotalSummary,
                TotalGstSummary = dto.TotalGstSummary,
                Adjustment = dto.Adjustment,
                RoundOff = dto.RoundOff,
                InvoiceAmount = dto.InvoiceAmount,
                PaidAmount = dto.PaidAmount, // initially collected if any
                CreatedAt = DateTime.UtcNow
            };

            foreach (var item in dto.Items)
            {
                masterEntity.Items.Add(new OtherPaymentInvoiceItem
                {
                    Type = item.Type,
                    Hsn = item.Hsn,
                    Description = item.Description,
                    Unit = item.Unit,
                    Rate = item.Rate,
                    Qty = item.Qty,
                    SubTotal = item.SubTotal,
                    GstRate = item.GstRate,
                    GstType = item.GstType,
                    GstAmount = item.GstAmount,
                    Total = item.Total
                });
            }

            await _unitOfWork.OtherPaymentInvoices.AddAsync(masterEntity);
            await _unitOfWork.SaveChangesAsync();
            return masterEntity.Id;
        }

        public async Task<bool> DeleteInvoiceAsync(int id)
        {
            var invoice = await _unitOfWork.OtherPaymentInvoices.GetByIdAsync(id);
            if (invoice == null) return false;

            invoice.IsDeleted = true;
            invoice.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}