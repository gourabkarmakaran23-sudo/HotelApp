using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Application.DTOs.Reservation
{
    public class CreateReservationDto
{
    public int GuestId { get; set; }

    public int RoomId { get; set; }

    public DateTime CheckInDate { get; set; }

    public DateTime CheckOutDate { get; set; }

    public int Adults { get; set; }

    public int Children { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal PaidAmount { get; set; }

    public string PaymentMode { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;
}
}