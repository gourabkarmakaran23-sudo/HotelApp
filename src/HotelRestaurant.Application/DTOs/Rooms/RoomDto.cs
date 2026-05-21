using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Application.DTOs.Rooms
{
    public class RoomDto
    {
        public int Id { get; set; }

        public string RoomNumber { get; set; } = string.Empty;

        public int RoomTypeId { get; set; }

        public int FLoorNumber { get; set; }

        public RoomStatus Status { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }

    public class CreateRoomDto
    {
        public string RoomNumber { get; set; } = string.Empty;

        public int RoomTypeId { get; set; }

        public int FLoorNumber { get; set; }

        public RoomStatus Status { get; set; }

        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class UpdateRoomDto
    {
        public int Id { get; set; }

        public string RoomNumber { get; set; } = string.Empty;

        public int RoomTypeId { get; set; }

        public int FLoorNumber { get; set; }

        public RoomStatus Status { get; set; }

        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }
}