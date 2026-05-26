using HotelRestaurant.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelRestaurant.Infrastructure.Data
{
    public sealed class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Hotel> Hotels => Set<Hotel>();
        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<RoomTypes> RoomTypes { get; set; }

        public DbSet<RoomTypeFacility> RoomTypeFacility { get; set; }
        public DbSet<Guest> Guests => Set<Guest>();
        public DbSet<ApplicationUser> ApplicationUsers => Set<ApplicationUser>();
        //public DbSet<Reservation> Reservations => Set<Reservation>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<ReservationRoom> ReservationRooms => Set<ReservationRoom>();
        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<MenuItem> MenuItems => Set<MenuItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Invoice> Invoices => Set<Invoice>();
        public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ⬇️ ADD THIS CONFIGURATION BLOCK HERE
            modelBuilder.Entity<RoomTypeFacility>(entity =>
            {
                // Define the composite key configuration using both foreign keys
                // (Verify that the property names match your actual RoomTypeFacility class exactly)
                entity.HasKey(rtf => new { rtf.RoomTypeId, rtf.RoomFacilityId });

                // Explicitly establish the relationship mapping back to RoomTypes
                entity.HasOne(rtf => rtf.RoomType)
                      .WithMany(rt => rt.RoomTypeFacilities) // or whatever your navigation property name is
                      .HasForeignKey(rtf => rtf.RoomTypeId)
                      .OnDelete(DeleteBehavior.Cascade);

                // If you have a Facility entity mapping as well, define it here:
                /*
                entity.HasOne(rtf => rtf.Facility)
                      .WithMany(f => f.RoomTypeFacilities)
                      .HasForeignKey(rtf => rtf.FacilityId)
                      .OnDelete(DeleteBehavior.Cascade);
                */
            });

            modelBuilder.Entity<Hotel>(entity =>
            {
                entity.Property(h => h.Name).IsRequired().HasMaxLength(150);
                entity.Property(h => h.Address).HasMaxLength(250);
                entity.Property(h => h.City).HasMaxLength(100);
                entity.Property(h => h.Country).HasMaxLength(100);
                entity.Property(h => h.Phone).HasMaxLength(30);
                entity.Property(h => h.Email).HasMaxLength(150);
                entity.Property(h => h.Rating).HasPrecision(3, 2);
            });

            modelBuilder.Entity<Room>(entity =>
            {
                entity.Property(r => r.RoomNumber).IsRequired().HasMaxLength(20);
                entity.Property(r => r.Price).HasPrecision(12, 2);
                entity.Property(r => r.Description).HasMaxLength(500);
                entity.HasOne(r => r.Hotel)
                    .WithMany(h => h.Rooms)
                    .HasForeignKey(r => r.HotelId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Guest>(entity =>
            {
                entity.Property(g => g.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(g => g.LastName).IsRequired().HasMaxLength(100);
                entity.Property(g => g.Email).HasMaxLength(150);
                entity.Property(g => g.Phone).HasMaxLength(50);
                entity.Property(g => g.Address).HasMaxLength(250);
                entity.Property(g => g.NationalId).HasMaxLength(100);
            });

            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(u => u.UserName).IsRequired().HasMaxLength(100);
                entity.Property(u => u.FullName).IsRequired().HasMaxLength(200);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Role).IsRequired().HasMaxLength(50);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.UserName).IsUnique();
            });
            modelBuilder.Entity<ReservationRoom>()
                .HasOne(x => x.Booking)
                .WithMany(x => x.ReservationRooms)
                .HasForeignKey(x => x.BookingId);

            modelBuilder.Entity<ReservationRoom>()
                .HasOne(x => x.Room)
                .WithMany()
                .HasForeignKey(x => x.RoomId);
            // modelBuilder.Entity<Reservation>(entity =>
            // {
            //     entity.Property(r => r.TotalAmount).HasPrecision(12, 2);
            //     entity.Property(r => r.Notes).HasMaxLength(500);
            //     entity.HasOne(r => r.Guest)
            //         .WithMany(g => g.Reservations)
            //         .HasForeignKey(r => r.GuestId)
            //         .OnDelete(DeleteBehavior.Restrict);

            //     entity.HasOne(r => r.Room)
            //         .WithMany(room => room.Reservations)
            //         .HasForeignKey(r => r.RoomId)
            //         .OnDelete(DeleteBehavior.Restrict);
            // });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(150);
                entity.Property(e => e.Phone).HasMaxLength(50);
                entity.Property(e => e.Salary).HasPrecision(12, 2);
                entity.HasOne(e => e.Hotel)
                    .WithMany(h => h.Employees)
                    .HasForeignKey(e => e.HotelId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<MenuItem>(entity =>
            {
                entity.Property(m => m.Name).IsRequired().HasMaxLength(150);
                entity.Property(m => m.Description).HasMaxLength(500);
                entity.Property(m => m.Price).HasPrecision(12, 2);
                entity.Property(m => m.IsAvailable).HasDefaultValue(true);
                entity.Property(m => m.Category).HasConversion<string>().HasMaxLength(50);
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(o => o.TotalAmount).HasPrecision(12, 2);
                entity.HasOne(o => o.Reservation)
                    .WithMany(r => r.Orders)
                    .HasForeignKey(o => o.ReservationId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(o => o.Guest)
                    .WithMany()
                    .HasForeignKey(o => o.GuestId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.Property(oi => oi.Quantity).IsRequired();
                entity.Property(oi => oi.UnitPrice).HasPrecision(12, 2);
                entity.Property(oi => oi.TotalPrice).HasPrecision(12, 2);
                entity.HasOne(oi => oi.Order)
                    .WithMany(o => o.OrderItems)
                    .HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(oi => oi.MenuItem)
                    .WithMany(m => m.OrderItems)
                    .HasForeignKey(oi => oi.MenuItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Invoice>(entity =>
            {
                entity.Property(i => i.Subtotal).HasPrecision(12, 2);
                entity.Property(i => i.Tax).HasPrecision(12, 2);
                entity.Property(i => i.Total).HasPrecision(12, 2);
                entity.Property(i => i.PaymentStatus).HasConversion<string>().HasMaxLength(50);

                entity.HasOne(i => i.Booking)
                    .WithMany(b => b.Invoices)
                    .HasForeignKey(i => i.BookingId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(i => i.Order)
                    .WithOne(o => o.Invoice)
                    .HasForeignKey<Invoice>(i => i.OrderId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<InventoryItem>(entity =>
            {
                entity.Property(i => i.Name).IsRequired().HasMaxLength(150);
                entity.Property(i => i.Category).HasMaxLength(100);
                entity.Property(i => i.QuantityOnHand).HasPrecision(12, 2);
                entity.Property(i => i.ReorderLevel).HasPrecision(12, 2);
                entity.Property(i => i.CostPrice).HasPrecision(12, 2);
                entity.Property(i => i.Unit).HasConversion<string>().HasMaxLength(50);
            });
        }
    }
}
