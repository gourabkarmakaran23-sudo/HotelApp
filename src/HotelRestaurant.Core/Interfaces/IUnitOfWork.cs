using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
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

        IGenericRepository<OpeningBalance> OpeningBalances { get; }
        #endregion
        #region Room Settings Repositories
        IGenericRepository<BedType> BedTypes { get; }
        IGenericRepository<BookingType> BookingTypes { get; }
        IGenericRepository<BookingSource> BookingSources { get; }
        #endregion
        #region Core Hotel & Restaurant Repositories
        IGenericRepository<Complementary> Complementaries { get; }
        IGenericRepository<FloorPlan> FloorPlans { get; }
        #endregion
        #region Other Payment
        // নিচের ইন্টারফেস প্রপার্টি দুটি যুক্ত করুন (Existing code এর ভেতরে)
        IGenericRepository<OtherPaymentInvoice> OtherPaymentInvoices { get; }
        IGenericRepository<OtherPaymentInvoiceItem> OtherPaymentInvoiceItems { get; }
        #endregion
        #region  Tax, Promocode, CancellationPolicies,Amenities
        // existing core repositories এর নিচে এই লাইনগুলো জুড়ে দিন:
        IGenericRepository<Tax> Taxes { get; }
        IGenericRepository<Promocode> Promocodes { get; }
        IGenericRepository<CancellationPolicy> CancellationPolicies { get; }
        IGenericRepository<Amenity> Amenities { get; }
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
        public IGenericRepository<RefundRecord> RefundRecords { get; }
        
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    }
}
