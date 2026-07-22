using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Core.Entities
{
    public class AgentCommission : BaseEntity,IMultiHotelEntity
{
        public int HotelId { get; set; } // Tracks which hotel owns this booking transaction
        public Hotel ?Hotel { get; set; }
    public int BookingId { get; set; }

    public int CommissionAgentId { get; set; }

    public decimal CommissionPercentage { get; set; }

    public decimal CommissionAmount { get; set; }

    public string PaymentStatus { get; set; } = "Due";

    public DateTime? PaidDate { get; set; }
}
}