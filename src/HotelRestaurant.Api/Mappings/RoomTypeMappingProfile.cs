using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HotelRestaurant.Application.DTOs.RoomTypes;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Api.Mappings
{
    public class RoomTypeMappingProfile:Profile
    {
        public RoomTypeMappingProfile()
        {
           CreateMap<CreateRoomTypeDto, RoomTypes>();

        // Fixes the Listing display mapping exception 
        CreateMap<RoomTypes, RoomTypeDto>();
        }
    }
}