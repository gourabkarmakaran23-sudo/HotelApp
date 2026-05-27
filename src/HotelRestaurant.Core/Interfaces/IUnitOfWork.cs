using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Core.Interfaces
{
    public interface IUnitOfWork:IDisposable
    {
        IGenericRepository<Hotel> Hotels { get; }
        IGenericRepository<RoomTypes> RoomTypes { get; }
        IGenericRepository<Room> Rooms { get; }
        IGenericRepository<Guest> Guests { get; }
        //IGenericRepository<Reservation> Reservations { get; }
        IGenericRepository<Booking> Bookings { get; }
        IGenericRepository<ReservationRoom> ReservationRooms { get; }
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
