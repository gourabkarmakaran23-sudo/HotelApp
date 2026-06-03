using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.Entities
{
    public class PaymentMethods : BaseEntity
    {
        public string MethodName { get; set; } = "";
        public bool IsActive { get; set; } = true;
    }
}