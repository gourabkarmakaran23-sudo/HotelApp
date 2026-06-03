using AutoMapper;
using HotelRestaurant.Application.DTOs.Master;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Api.Mappings
{
    public class MasterMappingProfile : Profile
    {
        public MasterMappingProfile()
        {
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

            CreateMap<PaymentMethods, PaymentMethodDto>()
    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
    .ForMember(dest => dest.MethodName, opt => opt.MapFrom(src => src.MethodName))
    .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
    .ReverseMap();
        }
    }
}