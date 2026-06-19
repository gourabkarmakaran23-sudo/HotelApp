using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using HotelRestaurant.Application.DTOs.Rooms;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Api.Mappings
{
    public class RoomMappingProfile:Profile
    {
        public RoomMappingProfile()
        {
            //Room Mappings
            CreateMap<Room, RoomDto>().ReverseMap();
            CreateMap<Room, CreateRoomDto>().ReverseMap();
            CreateMap<Room, UpdateRoomDto>().ReverseMap();
            
        }
    }
}