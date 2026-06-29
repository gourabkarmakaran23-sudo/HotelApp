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
            #region Master Data Repositories
            Currencies = new GenericRepository<Currency>(_context);
            PaymentMethods = new GenericRepository<PaymentMethods>(_context);
            CommissionAgents = new GenericRepository<CommissionAgent>(_context);
            FinancialYears = new GenericRepository<FinancialYear>(_context);
            AgentCommissions = new GenericRepository<AgentCommission>(_context);
            WakeUpCalls = new GenericRepository<WakeUpCall>(_context);
            PurchaseItems = new GenericRepository<PurchaseItem>(_context);
            PurchaseReturns = new GenericRepository<PurchaseReturn>(_context);
            #endregion
            #region Room Settings Repositories
            BedTypes = new GenericRepository<BedType>(_context);
            BookingTypes = new GenericRepository<BookingType>(_context);
            BookingSources = new GenericRepository<BookingSource>(_context);
            Complementaries = new GenericRepository<Complementary>(_context);
            FloorPlans = new GenericRepository<FloorPlan>(_context);
            #endregion
            #region  Other Payment
            // Constructor এর ভেতর ইন্সট্যান্স তৈরি করুন:
            OtherPaymentInvoices = new GenericRepository<OtherPaymentInvoice>(_context);
            OtherPaymentInvoiceItems = new GenericRepository<OtherPaymentInvoiceItem>(_context);
            #endregion
            #region  Tax, Promocode, CancellationPolicies,Amenities
            // Constructor এর ভেতর ইন্সট্যান্স তৈরি করুন:
            Taxes = new GenericRepository<Tax>(_context);
            Promocodes = new GenericRepository<Promocode>(_context);
            CancellationPolicies = new GenericRepository<CancellationPolicy>(_context);
            Amenities = new GenericRepository<Amenity>(_context);
            #endregion
            Hotels = new GenericRepository<Hotel>(_context);
            Rooms = new GenericRepository<Room>(_context);
            RoomTypes = new GenericRepository<RoomTypes>(_context);
            Guests = new GenericRepository<Guest>(_context);
            Bookings = new GenericRepository<Booking>(_context);
            ReservationRooms = new GenericRepository<ReservationRoom>(_context);
            BookingGuests = new GenericRepository<BookingGuest>(_context);
            BookingDocuments = new GenericRepository<BookingDocument>(_context);
            Reservations = new GenericRepository<Reservation>(_context);
            Employees = new GenericRepository<Employee>(_context);
            MenuItems = new GenericRepository<MenuItem>(_context);
            Orders = new GenericRepository<Order>(_context);
            OrderItems = new GenericRepository<OrderItem>(_context);
            Invoices = new GenericRepository<Invoice>(_context);
            Payments = new GenericRepository<Payment>(_context);
            InventoryItems = new GenericRepository<InventoryItem>(_context);
            // কনস্ট্রাক্টরের ভেতরে বসান:
            RefundRecords = new GenericRepository<RefundRecord>(_context);
        }
        #region Master Data Repositories
        public IGenericRepository<OpeningBalance> OpeningBalances { get; }
        #endregion
        #region Master Data Repositories
        public IGenericRepository<Currency> Currencies { get; }
        public IGenericRepository<PaymentMethods> PaymentMethods { get; }
        public IGenericRepository<CommissionAgent> CommissionAgents { get; }
        public IGenericRepository<FinancialYear> FinancialYears { get; }
        public IGenericRepository<AgentCommission> AgentCommissions { get; }
        public IGenericRepository<WakeUpCall> WakeUpCalls { get; }
        public IGenericRepository<PurchaseItem> PurchaseItems { get; }
        public IGenericRepository<PurchaseReturn> PurchaseReturns { get; }
        #endregion
        #region Room Settings Repositories
        public IGenericRepository<BedType> BedTypes { get; }
        public IGenericRepository<BookingType> BookingTypes { get; }
        public IGenericRepository<BookingSource> BookingSources { get; }
        #endregion
        #region Core Hotel & Restaurant RepoComplementariessitories
        public IGenericRepository<Complementary> Complementaries { get; }
        public IGenericRepository<FloorPlan> FloorPlans { get; }
        #endregion
        public IGenericRepository<Booking> Bookings { get; }
        public IGenericRepository<ReservationRoom> ReservationRooms { get; }
        public IGenericRepository<BookingGuest> BookingGuests { get; }
        public IGenericRepository<BookingDocument> BookingDocuments { get; }

        private IUserRepository? _users;
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
        public IGenericRepository<Payment> Payments { get; }
        public IGenericRepository<InventoryItem> InventoryItems { get; }
        #region  Other Payment
        // এবং প্রপার্টি এক্সপোজ করুন:
        public IGenericRepository<OtherPaymentInvoice> OtherPaymentInvoices { get; }
        public IGenericRepository<OtherPaymentInvoiceItem> OtherPaymentInvoiceItems { get; }
        #endregion

        #region  Tax, Promocode, CancellationPolicies,Amenities
        // এবং প্রপার্টি গেটার এক্সপোজ করুন:
        public IGenericRepository<Tax> Taxes { get; }
        public IGenericRepository<Promocode> Promocodes { get; }
        public IGenericRepository<CancellationPolicy> CancellationPolicies { get; }
        public IGenericRepository<Amenity> Amenities { get; }
        #endregion
        #region  Cancellation Management
        // নিচে প্রোপার্টি গেটার হিসেবে এক্সপোজ করুন:
        public IGenericRepository<RefundRecord> RefundRecords { get; }
        #endregion

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
