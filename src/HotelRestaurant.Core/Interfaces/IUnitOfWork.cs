using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Core.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<Hotel> Hotels { get; }
        IGenericRepository<Room> Rooms { get; }
        IGenericRepository<Guest> Guests { get; }
        IGenericRepository<Reservation> Reservations { get; }
        IGenericRepository<Employee> Employees { get; }
        IGenericRepository<MenuItem> MenuItems { get; }
        IGenericRepository<Order> Orders { get; }
        IGenericRepository<OrderItem> OrderItems { get; }
        IGenericRepository<Invoice> Invoices { get; }
        IGenericRepository<InventoryItem> InventoryItems { get; }
        IUserRepository ApplicationUsers { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
