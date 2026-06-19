using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using FluentValidation;
using HotelRestaurant.Api.Middleware;
using HotelRestaurant.Api.Models;
using HotelRestaurant.Api.Services;
using HotelRestaurant.Application.DTOs.Rooms.Validators;
using HotelRestaurant.Application.Services;
using HotelRestaurant.Application.Services.Implementations;
using HotelRestaurant.Application.Services.Interfaces;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Infrastructure.Data;
using HotelRestaurant.Infrastructure.Repositories;
using HotelRestaurant.Infrastructure.Services;
using HotelRestaurant.Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;

// ADD THIS EXACT LINE AT THE VERY TOP OF PROGRAM.CS:
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── 1. Database — EF Core + PostgreSQL ───────────────────────────────────────
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
    
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    // ADD THIS LINE TO SUPPRESS THE EXCEPTION:
    options.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
});

// Register all validators from the assembly where CreateRoomDtoValidator resides
builder.Services.AddValidatorsFromAssemblyContaining<CreateRoomDtoValidator>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// ── 3. Application Services ───────────────────────────────────────────────────
builder.Services.AddScoped<IAuthService, AuthService>();

// ── 4. JWT Service (Singleton — stateless, thread-safe) ──────────────────────
builder.Services.AddSingleton<IJwtService, JwtService>();

builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IRoomTypeService, RoomTypeService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IMasterService, MasterService>();
builder.Services.AddScoped<IAccountService, AccountService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// var jwtKey = builder.Configuration["JwtSettings:Key"] ?? throw new InvalidOperationException("JWT signing key is not configured.");
// var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "HotelRestaurantApi";
// var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "HotelRestaurantClient";

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
//         ValidateIssuer = true,
//         ValidIssuer = jwtIssuer,
//         ValidateAudience = true,
//         ValidAudience = jwtAudience,
//         ValidateLifetime = true,
//         ClockSkew = TimeSpan.FromMinutes(2)
//     };
// });

// ── 5. JWT Authentication ─────────────────────────────────────────────────────
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var jwtKey = jwtSection["Key"] ?? throw new InvalidOperationException("JWT signing key is not configured. Set JwtSettings:Key in appsettings.");
var jwtIssuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("JWT issuer is not configured. Set JwtSettings:Issuer in appsettings.");
var jwtAudience = jwtSection["Audience"] ?? throw new InvalidOperationException("JWT audience is not configured. Set JwtSettings:Audience in appsettings.");
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // set true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// ── 6. CORS — allow Angular dev server ───────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins(
                  "http://localhost:4200",
                  "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});

// ── 7. Controllers + Swagger ──────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "HotelRestaurant API",
        Version = "v1",
        Description = "Hotel & Restaurant Management System — Auth endpoints"
    });

    // Add JWT auth button in Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });
});


var app = builder.Build();

// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     var context = services.GetRequiredService<AppDbContext>();
//     await DbInitializer.InitializeAsync(context);
// }

// ── Auto-migrate on startup (dev convenience) ─────────────────────────────────
using (var scope = app.Services.CreateScope())
{
       var services = scope.ServiceProvider;
       var context = services.GetRequiredService<AppDbContext>();
       await DbInitializer.InitializeAsync(context);
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}
// ── Middleware pipeline ───────────────────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HotelRestaurant API v1");
        c.RoutePrefix = "swagger";
    });
}
app.UseHttpsRedirection();
//app.UseCors("AllowAngularDevClient");
// Enable CORS so your Angular app (port 4200) can communicate with port 5287
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

var apiGroup = app.MapGroup("/api");

var authGroup = apiGroup.MapGroup("/auth");

authGroup.MapPost("/register", async (RegisterRequest request, AppDbContext context) =>
{
    if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest("Name, email, and password are required.");
    }

    if (request.Password != request.ConfirmPassword)
    {
        return Results.BadRequest("Password and confirm password do not match.");
    }

    var normalizedEmail = request.Email.Trim().ToLowerInvariant();
    if (await context.ApplicationUsers.AnyAsync(u => u.Email == normalizedEmail))
    {
        return Results.Conflict("A user with this email already exists.");
    }

    var user = new ApplicationUser
    {
        UserName = request.Name.Trim(),
        Email = normalizedEmail,
        PasswordHash = PasswordHasher.HashPassword(request.Password),
        Role = "User",
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    await context.ApplicationUsers.AddAsync(user);
    await context.SaveChangesAsync();

    return Results.Created($"/api/auth/{user.Id}", new { user.Id, user.UserName, user.Email });
});

authGroup.MapPost("/login", async (LoginRequest request, AppDbContext context, IJwtTokenService tokenService) =>
{
    var normalizedEmail = request.Email.Trim().ToLowerInvariant();
    var user = await context.ApplicationUsers
        .FirstOrDefaultAsync(u => u.Email == normalizedEmail || u.UserName == request.Email.Trim());

    if (user is null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
    {
        return Results.Unauthorized();
    }

    var token = tokenService.CreateToken(user);
    return Results.Ok(new LoginResponse(token, 60));
});

apiGroup.MapGet("/dashboard/summary", async (AppDbContext context, ClaimsPrincipal user) =>
{
    var activeBookings =
    await context.Bookings.CountAsync();
    var revenue = await context.Invoices.SumAsync(i => (decimal?)i.Total) ?? 0m;
    var totalRooms = await context.Rooms.CountAsync();
    var pendingRequests = await context.Orders.CountAsync();

    var occupancyRate = totalRooms > 0
        ? (int)Math.Min(100, Math.Round((double)activeBookings / totalRooms * 100))
        : 0;

    return Results.Ok(new DashboardSummary(activeBookings, revenue, occupancyRate, pendingRequests));
})
.RequireAuthorization();

apiGroup.MapGet("/dashboard/occupancy", async (
    DateTime fromDate,
    DateTime toDate,
    string? searchRoomNumber,
    AppDbContext context,
    ClaimsPrincipal user) =>
{
    // Get all rooms
    var rooms = await context.Rooms.ToListAsync();
    
    // Apply search filter if provided
    if (!string.IsNullOrWhiteSpace(searchRoomNumber))
    {
        rooms = rooms.Where(r => r.RoomNumber.Contains(searchRoomNumber, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    // Get all reservations for the date range
var reservationRooms = await context.ReservationRooms
    .Include(r => r.Booking)
    .Where(r =>
        r.CheckInDate < toDate &&
        r.CheckOutDate > fromDate)
    .ToListAsync();
    // Build the occupancy grid
    var occupancyData = new List<object>();
    
    foreach (var room in rooms.OrderBy(r => r.RoomNumber))
    {
        var roomData = new Dictionary<string, object>
        {
            { "roomNumber", room.RoomNumber },
            { "roomId", room.Id }
        };

        // Generate dates for each day in the range
        var currentDate = fromDate.Date;
        while (currentDate <= toDate.Date)
        {
            var dateKey = currentDate.ToString("dd-MM-yyyy");
            
            // Check if room has reservation for this date
          var reservation = reservationRooms.FirstOrDefault(r =>
            r.RoomId == room.Id &&
            r.CheckInDate.Date <= currentDate &&
            r.CheckOutDate.Date > currentDate &&
            r.Status != BookingStatus.Cancelled);

            string status = "Available";
            if (reservation != null)
            {
                if (reservation.CheckInDate.Date == currentDate)
                    status = "CheckIn";
                else if (reservation.CheckOutDate.Date == currentDate)
                    status = "CheckOut";
                else
                    status = "Occupied";
            }

            roomData[dateKey] = new { date = dateKey, status = status };
            currentDate = currentDate.AddDays(1);
        }

        occupancyData.Add(roomData);
    }

    return Results.Ok(new { dates = GenerateDateRange(fromDate, toDate), rooms = occupancyData });
})
.RequireAuthorization();

static List<string> GenerateDateRange(DateTime fromDate, DateTime toDate)
{
    var dates = new List<string>();
    var currentDate = fromDate.Date;
    while (currentDate <= toDate.Date)
    {
        dates.Add(currentDate.ToString("dd-MM-yyyy"));
        currentDate = currentDate.AddDays(1);
    }
    return dates;
}
// 2. CRITICAL MIDDLEWARE ENDPOINT: Instructs Web API to map your controller endpoints
app.MapControllers();
await app.RunAsync();
