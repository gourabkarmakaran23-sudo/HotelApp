using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HotelRestaurant.Application.DTOs.RoomSettings;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Api.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Room Settings Mappings
            CreateMap<BedType, BedTypeDto>().ReverseMap();
            CreateMap<BookingType, BookingTypeDto>().ReverseMap();
            CreateMap<BookingSource, BookingSourceDto>().ReverseMap();

            CreateMap<Complementary, ComplementaryDto>().ReverseMap();
            CreateMap<FloorPlan, FloorPlanDto>().ReverseMap();
        }
    }
}