using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Entities.HouseKeeping;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Infrastructure.Data;
using HotelRestaurant.Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Storage;

namespace HotelRestaurant.Infrastructure.UnitOfWork
{
    public sealed class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        //private IHotelRepository? _hotels;

        public UnitOfWork(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;

            #region Master Data Repositories
            Currencies = new GenericRepository<Currency>(_context, _httpContextAccessor);
            PaymentMethods = new GenericRepository<PaymentMethods>(_context, _httpContextAccessor);
            CommissionAgents = new GenericRepository<CommissionAgent>(_context, _httpContextAccessor);
            FinancialYears = new GenericRepository<FinancialYear>(_context, _httpContextAccessor);
            AgentCommissions = new GenericRepository<AgentCommission>(_context, _httpContextAccessor);
            WakeUpCalls = new GenericRepository<WakeUpCall>(_context, _httpContextAccessor);
            PurchaseItems = new GenericRepository<PurchaseItem>(_context, _httpContextAccessor);
            PurchaseReturns = new GenericRepository<PurchaseReturn>(_context, _httpContextAccessor);
            #endregion
            #region Room Settings Repositories
            BedTypes = new GenericRepository<BedType>(_context, _httpContextAccessor);
            BookingTypes = new GenericRepository<BookingType>(_context, _httpContextAccessor);
            BookingSources = new GenericRepository<BookingSource>(_context, _httpContextAccessor);
            Complementaries = new GenericRepository<Complementary>(_context, _httpContextAccessor);
            FloorPlans = new GenericRepository<FloorPlan>(_context, _httpContextAccessor);
            #endregion
            #region  Other Payment
            // Constructor এর ভেতর ইন্সট্যান্স তৈরি করুন:
            OtherPaymentInvoices = new GenericRepository<OtherPaymentInvoice>(_context, _httpContextAccessor);
            OtherPaymentInvoiceItems = new GenericRepository<OtherPaymentInvoiceItem>(_context, _httpContextAccessor);
            #endregion
            #region  Tax, Promocode, CancellationPolicies,Amenities
            // Constructor এর ভেতর ইন্সট্যান্স তৈরি করুন:
            Taxes = new GenericRepository<Tax>(_context, _httpContextAccessor);
            Promocodes = new GenericRepository<Promocode>(_context, _httpContextAccessor);
            CancellationPolicies = new GenericRepository<CancellationPolicy>(_context, _httpContextAccessor);
            Amenities = new GenericRepository<Amenity>(_context, _httpContextAccessor);
            #endregion
            Hotels = new GenericRepository<Hotel>(_context, _httpContextAccessor);
            Rooms = new GenericRepository<Room>(_context, _httpContextAccessor);
            RoomTypes = new GenericRepository<RoomTypes>(_context, _httpContextAccessor);
            Guests = new GenericRepository<Guest>(_context, _httpContextAccessor);
            Bookings = new GenericRepository<Booking>(_context, _httpContextAccessor);
            ReservationRooms = new GenericRepository<ReservationRoom>(_context, _httpContextAccessor);
            BookingGuests = new GenericRepository<BookingGuest>(_context, _httpContextAccessor);
            BookingDocuments = new GenericRepository<BookingDocument>(_context, _httpContextAccessor);
            Reservations = new GenericRepository<Reservation>(_context, _httpContextAccessor);
            Employees = new GenericRepository<Employee>(_context, _httpContextAccessor);
            MenuItems = new GenericRepository<MenuItem>(_context, _httpContextAccessor);
            Orders = new GenericRepository<Order>(_context, _httpContextAccessor);
            OrderItems = new GenericRepository<OrderItem>(_context, _httpContextAccessor);
            Invoices = new GenericRepository<Invoice>(_context, _httpContextAccessor);
            Payments = new GenericRepository<Payment>(_context, _httpContextAccessor);
            InventoryItems = new GenericRepository<InventoryItem>(_context, _httpContextAccessor);
            // কনস্ট্রাক্টরের ভেতরে বসান:
            RefundRecords = new GenericRepository<RefundRecord>(_context, _httpContextAccessor);

            //(Constructor) এর ভেতরে এগুলো এসাইন করুন:
            RoomCleanings = new GenericRepository<RoomCleaning>(_context, _httpContextAccessor);
            HouseKeepingChecklists = new GenericRepository<HouseKeepingChecklist>(_context, _httpContextAccessor);
            LaundryLogs = new GenericRepository<LaundryLog>(_context, _httpContextAccessor);
            LaundryPayments = new GenericRepository<LaundryPayment>(_context, _httpContextAccessor);
        }

        // public async Task<IDisposable> BeginTransactionAsync()
        // {
        //     // EF's transaction object naturally implements IDisposable
        //     return await _context.Database.BeginTransactionAsync();
        // }

        #region Master Data Repositories
        public IGenericRepository<OpeningBalance> OpeningBalances { get; } = null!;
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
        // UnitOfWork.cs এর ভেতরে এই সেকশনটি অ্যাড করুন:

        #region House Keeping & Laundry Repositories
        public IGenericRepository<RoomCleaning> RoomCleanings { get; }
        public IGenericRepository<HouseKeepingChecklist> HouseKeepingChecklists { get; }
        public IGenericRepository<LaundryLog> LaundryLogs { get; }
        public IGenericRepository<LaundryPayment> LaundryPayments { get; }
        #endregion

        public IUserRepository ApplicationUsers
        => _users ??= new UserRepository(_context);

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        #region Transaction Management
        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }
        #endregion
        
        public void Dispose()
        => _context.Dispose();
    }
}
