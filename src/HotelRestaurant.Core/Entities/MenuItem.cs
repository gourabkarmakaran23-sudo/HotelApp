namespace HotelRestaurant.Core.Entities
{
    public class MenuItem : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public MenuCategory Category { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; } = true;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
