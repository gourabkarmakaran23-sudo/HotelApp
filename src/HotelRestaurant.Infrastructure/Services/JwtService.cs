using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HotelRestaurant.Infrastructure.Services;

/// <summary>
/// JWT token generator — Singleton in DI (stateless, thread-safe).
/// Single Responsibility: only builds and signs JWT tokens.
/// </summary>
public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(ApplicationUser user)
    {
        var jwtSection = _config.GetSection("JwtSettings");
        var key        = new SymmetricSecurityKey(
                             Encoding.UTF8.GetBytes(jwtSection["Key"] ?? "SuperSecretKey12345!Hotel2026JwtTokenSecret"));
        var creds      = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var canViewAllHotels = string.Equals(user.Role, "SuperAdmin", StringComparison.OrdinalIgnoreCase)
            || string.Equals(user.Role, "Admin", StringComparison.OrdinalIgnoreCase);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name,               user.FullName),
            new Claim(ClaimTypes.Role,               user.Role),
            new Claim("hotel_id",                   user.HotelId.ToString()),
            new Claim("can_view_all_hotels",        canViewAllHotels ? "true" : "false"),
            new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
        };

        var expiryMinutes = int.TryParse(jwtSection["ExpiryMinutes"], out var parsedExpiry)
            ? parsedExpiry
            : 60;

        var token = new JwtSecurityToken(
            issuer:             jwtSection["Issuer"] ?? "HotelRestaurantApi",
            audience:           jwtSection["Audience"] ?? "HotelRestaurantClient",
            claims:             claims,
            expires:            DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}