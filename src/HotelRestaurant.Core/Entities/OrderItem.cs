using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Core.Entities
{
    public class OrderItem : BaseEntity,IMultiHotelEntity
    {
        public int HotelId { get; set; } // Essential for tracing specific hotel outlays
        public Hotel Hotel { get; set; }
        public int OrderId { get; set; }
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }

        public Order? Order { get; set; }
        public MenuItem? MenuItem { get; set; }
    }
}
