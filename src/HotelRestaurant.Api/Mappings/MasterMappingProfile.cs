using AutoMapper;
using HotelRestaurant.Application.DTOs.Master;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Api.Mappings
{
    public class MasterMappingProfile : Profile
    {
        public MasterMappingProfile()
        {
            // Add this inside your MappingProfile constructor class setup:
            CreateMap<WakeUpCall, WakeUpCallDto>().ReverseMap();
            // Currency
            CreateMap<Currency, CurrencyDto>().ReverseMap();

            // Payment Method
            CreateMap<PaymentMethod, PaymentMethodDto>().ReverseMap();

            // Commission Agent
            CreateMap<CommissionAgent, CommissionAgentDto>().ReverseMap();

            // Agent Commission
            CreateMap<AgentCommission, AgentCommissionDto>().ReverseMap();

            // Financial Year
            CreateMap<FinancialYear, FinancialYearDto>().ReverseMap();

            // Add these explicit lines to fix your missing type map configuration errors:
            CreateMap<PurchaseItemDto, PurchaseItem>().ReverseMap();
            CreateMap<PurchaseReturnDto, PurchaseReturn>().ReverseMap();

            CreateMap<PaymentMethods, PaymentMethodDto>()
    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
    .ForMember(dest => dest.MethodName, opt => opt.MapFrom(src => src.MethodName))
    .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
    .ReverseMap();
        }
    }
}