using HotelRestaurant.Core.Interfaces;
namespace HotelRestaurant.Core.Entities
{
    public class InventoryItem : BaseEntity,IMultiHotelEntity
    {
        public int HotelId { get; set; } // Essential for tracing specific hotel outlays
        public Hotel Hotel { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal QuantityOnHand { get; set; }
        public InventoryUnit Unit { get; set; }
        public decimal ReorderLevel { get; set; }
        public decimal CostPrice { get; set; }
    }
}
