using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HotelRestaurant.Api.Models;
using HotelRestaurant.Api.Services;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Infrastructure.Data;
using HotelRestaurant.Infrastructure.Repositories;
using HotelRestaurant.Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var jwtKey = builder.Configuration["JwtSettings:Key"] ?? throw new InvalidOperationException("JWT signing key is not configured.");
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "HotelRestaurantApi";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "HotelRestaurantClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2)
    };
});

builder.Services.AddAuthorization();

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    await DbInitializer.InitializeAsync(context);
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAngularDevClient");
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
    var activeBookings = await context.Reservations.CountAsync();
    var revenue = await context.Invoices.SumAsync(i => (decimal?)i.Total) ?? 0m;
    var totalRooms = await context.Rooms.CountAsync();
    var pendingRequests = await context.Orders.CountAsync();

    var occupancyRate = totalRooms > 0
        ? (int)Math.Min(100, Math.Round((double)activeBookings / totalRooms * 100))
        : 0;

    return Results.Ok(new DashboardSummary(activeBookings, revenue, occupancyRate, pendingRequests));
})
.RequireAuthorization();

await app.RunAsync();
