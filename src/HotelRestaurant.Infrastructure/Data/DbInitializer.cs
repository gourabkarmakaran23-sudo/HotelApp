using HotelRestaurant.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelRestaurant.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(AppDbContext context)
        {
            await context.Database.MigrateAsync();

            if (await context.Hotels.AnyAsync())
            {
                return;
            }

            var hotel = new Hotel
            {
                Name = "Azure Lake Hotel",
                Address = "125 Lake View Boulevard",
                City = "Harmony",
                Country = "Utopia",
                Phone = "+1-555-0110",
                Email = "info@azurelakehotel.com",
                Rating = 4.8m
            };

            var rooms = new List<Room>
            {
                new Room { RoomNumber = "101", RoomType = RoomType.Standard, Capacity = 2, Price = 120m, Status = RoomStatus.Available, Description = "Standard room with garden view", Hotel = hotel },
                new Room { RoomNumber = "102", RoomType = RoomType.Deluxe, Capacity = 3, Price = 180m, Status = RoomStatus.Available, Description = "Deluxe room with balcony", Hotel = hotel },
                new Room { RoomNumber = "201", RoomType = RoomType.Suite, Capacity = 4, Price = 320m, Status = RoomStatus.Available, Description = "Spacious suite with lake view", Hotel = hotel }
            };

            var employee = new Employee
            {
                Hotel = hotel,
                FirstName = "Mia",
                LastName = "Robinson",
                Email = "mia.robinson@azurelakehotel.com",
                Phone = "+1-555-0123",
                Role = EmployeeRole.Manager,
                HireDate = DateTime.UtcNow.AddYears(-3),
                Salary = 4500m
            };

            var guest = new Guest
            {
                FirstName = "Ethan",
                LastName = "Grant",
                Email = "ethan.grant@example.com",
                Phone = "+1-555-0145",
                Address = "17 Maple Street, Harmony",
                NationalId = "ID123456789",
                DateOfBirth = new DateTime(1990, 4, 22)
            };

            var reservation = new Reservation
            {
                Guest = guest,
                Room = rooms[1],
                CheckInDate = DateTime.UtcNow.Date.AddDays(3),
                CheckOutDate = DateTime.UtcNow.Date.AddDays(6),
                Status = ReservationStatus.Confirmed,
                Adults = 2,
                Children = 1,
                TotalAmount = 540m,
                Notes = "Late check-in requested"
            };

            var menuItems = new List<MenuItem>
            {
                new MenuItem { Name = "Grilled Salmon", Category = MenuCategory.MainCourse, Description = "Fresh salmon with lemon butter sauce", Price = 24.50m, IsAvailable = true },
                new MenuItem { Name = "Caesar Salad", Category = MenuCategory.Appetizer, Description = "Crisp romaine with creamy dressing", Price = 9.95m, IsAvailable = true },
                new MenuItem { Name = "Chocolate Lava Cake", Category = MenuCategory.Dessert, Description = "Warm chocolate cake with molten center", Price = 8.75m, IsAvailable = true },
                new MenuItem { Name = "Sparkling Water", Category = MenuCategory.Beverage, Description = "Chilled sparkling water", Price = 3.50m, IsAvailable = true }
            };

            var order = new Order
            {
                Reservation = reservation,
                Guest = guest,
                OrderDate = DateTime.UtcNow,
                OrderStatus = OrderStatus.Pending,
                TotalAmount = 46.95m
            };

            order.OrderItems.Add(new OrderItem
            {
                Order = order,
                MenuItem = menuItems[0],
                Quantity = 1,
                UnitPrice = menuItems[0].Price,
                TotalPrice = menuItems[0].Price
            });

            order.OrderItems.Add(new OrderItem
            {
                Order = order,
                MenuItem = menuItems[1],
                Quantity = 1,
                UnitPrice = menuItems[1].Price,
                TotalPrice = menuItems[1].Price
            });

            var invoice = new Invoice
            {
                Reservation = reservation,
                Order = order,
                InvoiceDate = DateTime.UtcNow,
                Subtotal = 540m + 46.95m,
                Tax = 58.10m,
                Total = 645.05m,
                PaymentStatus = PaymentStatus.Unpaid
            };

            var inventoryItems = new List<InventoryItem>
            {
                new InventoryItem { Name = "Premium Coffee Beans", Category = "Beverage", QuantityOnHand = 25m, Unit = InventoryUnit.Kilogram, ReorderLevel = 5m, CostPrice = 18.50m },
                new InventoryItem { Name = "Fresh Salmon Fillets", Category = "Seafood", QuantityOnHand = 15m, Unit = InventoryUnit.Kilogram, ReorderLevel = 3m, CostPrice = 12.00m }
            };

            context.Hotels.Add(hotel);
            context.Rooms.AddRange(rooms);
            context.Employees.Add(employee);
            context.Guests.Add(guest);
            context.Reservations.Add(reservation);
            context.MenuItems.AddRange(menuItems);
            context.Orders.Add(order);
            context.Invoices.Add(invoice);
            context.InventoryItems.AddRange(inventoryItems);

            await context.SaveChangesAsync();
        }
    }
}
