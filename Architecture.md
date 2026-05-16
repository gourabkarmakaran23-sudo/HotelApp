# Hotel & Restaurant Software Architecture

## Overview

This architecture defines a professional Hotel & Restaurant management system using:

- **Backend**: .NET Core / .NET 8+ (ASP.NET Core Web API)
- **Frontend**: Angular (latest stable version)
- **Database**: PostgreSQL (recommended) or SQL Server
- **ORM**: Entity Framework Core (Code First)
- **Authentication**: JWT
- **Validation**: FluentValidation
- **Logging**: Serilog (or built-in Microsoft logging)
- **Error handling**: Middleware-based global error handling
- **Reporting**: PDF export, Excel/CSV export

---

## Solution Structure

```
HotelRestaurant.sln

src/
  HotelRestaurant.Api/            # ASP.NET Core Web API project
  HotelRestaurant.Application/    # Application services, DTOs, validation, business logic
  HotelRestaurant.Infrastructure/ # EF Core, repository, UnitOfWork, persistence
  HotelRestaurant.Core/           # Domain entities, enums, interfaces, shared kernel

client-app/                      # Angular SPA project
  src/app/
    auth/
    dashboard/
    reservations/
    hotel-management/
    restaurant-management/
    inventory/
    reports/
    settings/
```

---

## Layered Architecture

### 1. Core Layer

Contains domain entities, domain value objects, repository interfaces, and shared constants.

Responsibilities:
- Hotel, Room, Reservation, Employee, Menu, Order, Invoice, Inventory models
- Interfaces for repositories and unit of work
- Domain-specific enums and value objects

### 2. Application Layer

Contains business workflows, request/response DTOs, validation rules, and service interfaces.

Responsibilities:
- Use cases and application services
- DTOs and mapping profiles
- FluentValidation validators
- Command/query handlers (if using CQRS style)
- Business rules and orchestration logic

### 3. Infrastructure Layer

Contains database context, EF Core configuration, repository implementations, UnitOfWork, logging, PDF/Excel export, and third-party integrations.

Responsibilities:
- `DbContext`, migrations, and seed data
- Repository & UnitOfWork implementations
- Persistence-specific services
- PDF export service (IText7, QuestPDF, or PDFSharp)
- Excel/CSV export service (ClosedXML, CsvHelper)
- External providers and application settings

### 4. API Layer

Contains controllers, middleware, authentication/authorization, API contracts, and OpenAPI/Swagger configuration.

Responsibilities:
- Web API controllers and routing
- JWT authentication setup
- Error handling middleware
- Logging middleware hooks
- API versioning and Swagger docs

---

## Key Design Principles

- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY**: Reuse services, validation logic, and mapping profiles
- **Repository Pattern**: Abstract data access behind repository interfaces
- **UnitOfWork Pattern**: Manage transaction boundaries in a consistent unit
- **Singleton Pattern**: Single shared services such as configuration or logger in DI container
- **Separation of Concerns**: Keep API, application logic, and infrastructure separate
- **Testability**: Design services and handlers for dependency injection and unit testing

---

## Database Model (Example Entities)

### Core Entities

- `Hotel`
  - Name, Address, Country, City, Phone, Email, Rating
- `Room`
  - RoomNumber, RoomType, Capacity, Price, Status, HotelId
- `Guest`
  - FirstName, LastName, Email, Phone, Address, NationalId
- `Reservation`
  - GuestId, RoomId, CheckInDate, CheckOutDate, Status, TotalAmount
- `Employee`
  - FullName, Role, Email, Phone, HireDate, Salary, HotelId
- `MenuItem`
  - Name, Category, Price, Description, IsAvailable
- `Order`
  - ReservationId, GuestId, OrderDate, OrderStatus, TotalAmount
- `OrderItem`
  - OrderId, MenuItemId, Quantity, UnitPrice, TotalPrice
- `Invoice`
  - ReservationId, OrderId, InvoiceDate, Subtotal, Tax, Total, PaymentStatus
- `InventoryItem`
  - Name, Category, Quantity, Unit, ReorderLevel, CostPrice

### Relationships

- `Hotel` 1..* `Room`
- `Hotel` 1..* `Employee`
- `Guest` 1..* `Reservation`
- `Reservation` 1..1 `Room`
- `Reservation` 1..* `Order`
- `Order` 1..* `OrderItem`
- `OrderItem` -> `MenuItem`
- `Invoice` optional `Reservation` and/or `Order`

---

## Backend Technology Stack

- `.NET 8+` or latest stable .NET
- `ASP.NET Core Web API`
- `Entity Framework Core`
- `Npgsql.EntityFrameworkCore.PostgreSQL` or `Microsoft.EntityFrameworkCore.SqlServer`
- `FluentValidation.AspNetCore`
- `Serilog.AspNetCore` or built-in logging
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `AutoMapper` or manual mapping
- `Swashbuckle.AspNetCore` for Swagger
- `QuestPDF` / `IText7` / `PdfSharpCore` for PDF generation
- `ClosedXML` / `CsvHelper` for Excel/CSV export

---

## Frontend Architecture

### Angular Modules

- `AuthModule`
  - Login, Register, Forgot Password, JWT token handling
- `DashboardModule`
  - KPIs, occupancy, revenue, reservation summary
- `HotelModule`
  - Room management, room types, hotel details
- `RestaurantModule`
  - Menu management, table management, orders, kitchen status
- `ReservationModule`
  - New bookings, check-in/check-out, customer history
- `InventoryModule`
  - Stock levels, purchase orders, inventory alerts
- `ReportsModule`
  - PDF export, Excel export, sales, invoice reports
- `AdminModule`
  - Employee management, roles, permissions, settings

### Frontend Features

- Responsive professional UI
- Material Design or a premium dashboard template
- Role-based access control
- Reusable UI components: tables, dialogs, forms, charts
- HTTP interceptor for JWT and error handling
- Centralized state management if needed (NgRx or service-based)

---

## Cross-Cutting Services

- Global error handling middleware
- Central logging service
- JWT authentication and authorization
- Validation pipeline using FluentValidation
- PDF/Excel exporter service
- Database migration and seed data
- App settings and configuration providers

---

## Recommended Initial CLI Setup

```
# Create solution and projects
dotnet new sln -n HotelRestaurant
mkdir src
cd src
dotnet new webapi -n HotelRestaurant.Api
dotnet new classlib -n HotelRestaurant.Application
dotnet new classlib -n HotelRestaurant.Infrastructure
dotnet new classlib -n HotelRestaurant.Core

# Add to solution
cd ..
dotnet sln add src/HotelRestaurant.Api/HotelRestaurant.Api.csproj
dotnet sln add src/HotelRestaurant.Application/HotelRestaurant.Application.csproj
dotnet sln add src/HotelRestaurant.Infrastructure/HotelRestaurant.Infrastructure.csproj
dotnet sln add src/HotelRestaurant.Core/HotelRestaurant.Core.csproj

# Add project references
cd src/HotelRestaurant.Api
dotnet add reference ..\HotelRestaurant.Application\HotelRestaurant.Application.csproj
cd ..\HotelRestaurant.Application
dotnet add reference ..\HotelRestaurant.Core\HotelRestaurant.Core.csproj
cd ..\HotelRestaurant.Infrastructure
dotnet add reference ..\HotelRestaurant.Core\HotelRestaurant.Core.csproj
cd ..\HotelRestaurant.Application
dotnet add reference ..\HotelRestaurant.Infrastructure\HotelRestaurant.Infrastructure.csproj

# Add EF Core and other dependencies
cd ..\HotelRestaurant.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
cd ..\HotelRestaurant.Api
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package FluentValidation.AspNetCore
dotnet add package Swashbuckle.AspNetCore
dotnet add package Serilog.AspNetCore

# Frontend
cd ..\..\
ng new client-app --routing --style=scss
```

---

## Next Step

1. Create the domain model and database entities in `HotelRestaurant.Core`
2. Implement repository and UnitOfWork interfaces in `HotelRestaurant.Infrastructure`
3. Add validation and service orchestration in `HotelRestaurant.Application`
4. Build API controllers and middleware in `HotelRestaurant.Api`
5. Scaffold Angular modules and UI components in `client-app`

## Current Implementation

- Database entities and schema are now defined in `src/HotelRestaurant.Core/Entities`
- `AppDbContext` is configured in `src/HotelRestaurant.Infrastructure/Data/AppDbContext.cs`
- `DbInitializer` seeds sample hotel, guest, reservation, order, invoice, and inventory data in `src/HotelRestaurant.Infrastructure/Data/DbInitializer.cs`
- Generic repository and UnitOfWork patterns are implemented in `src/HotelRestaurant.Infrastructure`
- PostgreSQL connection string is configured in `src/HotelRestaurant.Api/appsettings.json`
- API startup now registers EF Core, repository, and unit-of-work services in `src/HotelRestaurant.Api/Program.cs`
- Initial EF Core migration created in `src/HotelRestaurant.Infrastructure/Migrations`

## Database Deployment

- Run `dotnet ef database update --project src/HotelRestaurant.Infrastructure/HotelRestaurant.Infrastructure.csproj --startup-project src/HotelRestaurant.Api/HotelRestaurant.Api.csproj` to apply the schema.
- Ensure the PostgreSQL connection string in `src/HotelRestaurant.Api/appsettings.json` uses valid credentials for `postgres` or update it to your database account.
