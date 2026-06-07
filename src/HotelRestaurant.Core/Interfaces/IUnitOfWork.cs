using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Core.Interfaces
{
    public interface IUnitOfWork:IDisposable
    {
        #region Master Data Repositories
            IGenericRepository<Currency> Currencies { get; }
            IGenericRepository<PaymentMethods> PaymentMethods { get; }
            IGenericRepository<CommissionAgent> CommissionAgents { get; }
            IGenericRepository<FinancialYear> FinancialYears { get; }
            IGenericRepository<AgentCommission> AgentCommissions { get; }
            IGenericRepository<WakeUpCall> WakeUpCalls { get; }

            IGenericRepository<PurchaseItem> PurchaseItems { get; }
            IGenericRepository<PurchaseReturn> PurchaseReturns { get; }
        #endregion
        #region Room Settings Repositories
            IGenericRepository<BedType> BedTypes { get; }
            IGenericRepository<BookingType> BookingTypes { get; }
            IGenericRepository<BookingSource> BookingSources { get; }
        #endregion
        IGenericRepository<Hotel> Hotels { get; }
        IGenericRepository<RoomTypes> RoomTypes { get; }
        IGenericRepository<Room> Rooms { get; }
        IGenericRepository<Guest> Guests { get; }
        IGenericRepository<Reservation> Reservations { get; }
        IGenericRepository<Booking> Bookings { get; }
        IGenericRepository<ReservationRoom> ReservationRooms { get; }
        IGenericRepository<BookingGuest> BookingGuests { get; }
        IGenericRepository<BookingDocument> BookingDocuments { get; }
        IGenericRepository<Employee> Employees { get; }
        IGenericRepository<MenuItem> MenuItems { get; }
        IGenericRepository<Order> Orders { get; }
        IGenericRepository<OrderItem> OrderItems { get; }
        IGenericRepository<Invoice> Invoices { get; }
        IGenericRepository<Payment> Payments { get; }
        IGenericRepository<InventoryItem> InventoryItems { get; }
        IUserRepository ApplicationUsers { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
