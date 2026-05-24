using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Application.DTOs.Rooms
{
    public class RoomDto
    {
        public int? HotelId { get; set; }
        public int Id { get; set; }

        public string RoomNumber { get; set; } = string.Empty;

        public int RoomTypesId { get; set; }

        public int FloorNo { get; set; } // <-- Changed from FloorNumber to FloorNo

        // public int RoomTypesId { get; set; }
        public string RoomTypeName { get; set; } = string.Empty;

        public decimal Price { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public RoomStatus Status { get; set; } // <-- CHANGE THIS from string to RoomStatus Enum!        public string? Description { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

          public string? Description { get; set; }
    }

    public class CreateRoomDto
    {
        public int? HotelId { get; set; }
        public string RoomNumber { get; set; } = string.Empty;

        //public int RoomTypeId { get; set; }

        public int FloorNo { get; set; } // <-- Changed from FloorNumber to FloorNo

        public int RoomTypesId { get; set; }

        public decimal Price { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public RoomStatus Status { get; set; } = RoomStatus.Available; // Change from string to RoomStatus enum
        public string? Description { get; set; }

    }

    public class UpdateRoomDto
{
    public int Id { get; set; }
    public int? HotelId { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public int RoomTypesId { get; set; }
    public decimal Price { get; set; }
    public int FloorNo { get; set; } 

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public RoomStatus Status { get; set; } // <-- FIX: Changed from string to RoomStatus

    public string? Description { get; set; }
    public bool IsActive { get; set; }
}
}