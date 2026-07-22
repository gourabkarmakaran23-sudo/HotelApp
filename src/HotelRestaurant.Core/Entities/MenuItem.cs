using HotelRestaurant.Core.Interfaces;

namespace HotelRestaurant.Core.Entities
{
    public class MenuItem : BaseEntity,IMultiHotelEntity
    {
        public int HotelId { get; set; } // Essential for tracing specific hotel outlays
        public Hotel Hotel { get; set; }
    
        public string Name { get; set; } = string.Empty;
        public MenuCategory Category { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
