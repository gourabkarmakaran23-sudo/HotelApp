using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Infrastructure.Data;
using HotelRestaurant.Infrastructure.Repositories;

namespace HotelRestaurant.Infrastructure.UnitOfWork
{
    public sealed class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Hotels = new GenericRepository<Hotel>(_context);
            Rooms = new GenericRepository<Room>(_context);
            RoomTypes = new GenericRepository<RoomTypes>(_context);
            Guests = new GenericRepository<Guest>(_context);
            Bookings = new GenericRepository<Booking>(_context);
            ReservationRooms = new GenericRepository<ReservationRoom>(_context);
            BookingGuests = new GenericRepository<BookingGuest>(_context);
            BookingDocuments = new GenericRepository<BookingDocument>(_context);
            // Reservations = new GenericRepository<Reservation>(_context);
            Employees = new GenericRepository<Employee>(_context);
            MenuItems = new GenericRepository<MenuItem>(_context);
            Orders = new GenericRepository<Order>(_context);
            OrderItems = new GenericRepository<OrderItem>(_context);
            Invoices = new GenericRepository<Invoice>(_context);
            InventoryItems = new GenericRepository<InventoryItem>(_context);
        }

         public IGenericRepository<Booking> Bookings { get; }
         public IGenericRepository<ReservationRoom> ReservationRooms { get; }
         public IGenericRepository<BookingGuest> BookingGuests { get; }

        public IGenericRepository<BookingDocument> BookingDocuments { get; }


          private IUserRepository?      _users;
        public IGenericRepository<Hotel> Hotels { get; }
        public IGenericRepository<Room> Rooms { get; }
        public IGenericRepository<RoomTypes> RoomTypes { get; }
        public IGenericRepository<Guest> Guests { get; }
        public IGenericRepository<Reservation> Reservations { get; }
        public IGenericRepository<Employee> Employees { get; }
        public IGenericRepository<MenuItem> MenuItems { get; }
        public IGenericRepository<Order> Orders { get; }
        public IGenericRepository<OrderItem> OrderItems { get; }
        public IGenericRepository<Invoice> Invoices { get; }
        public IGenericRepository<InventoryItem> InventoryItems { get; }
 
        public IUserRepository ApplicationUsers
        => _users ??= new UserRepository(_context);
 
        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }
        public void Dispose()
        => _context.Dispose();
    }
}
