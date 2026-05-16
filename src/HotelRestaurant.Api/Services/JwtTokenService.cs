using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HotelRestaurant.Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HotelRestaurant.Api.Services
{
    public interface IJwtTokenService
    {
        string CreateToken(ApplicationUser user);
    }

    public sealed class JwtTokenService : IJwtTokenService
    {
        private readonly string _issuer;
        private readonly string _audience;
        private readonly string _key;
        private readonly int _expiryMinutes;

        public JwtTokenService(IConfiguration configuration)
        {
            _issuer = configuration["JwtSettings:Issuer"] ?? "HotelRestaurantApi";
            _audience = configuration["JwtSettings:Audience"] ?? "HotelRestaurantClient";
            _key = configuration["JwtSettings:Key"] ?? throw new InvalidOperationException("JWT signing key is not configured.");
            _expiryMinutes = int.TryParse(configuration["JwtSettings:ExpiryMinutes"], out var expiry) ? expiry : 60;
        }

        public string CreateToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var jwtToken = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(_expiryMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
