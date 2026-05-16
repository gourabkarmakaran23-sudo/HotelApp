using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelRestaurant.Core.DTOs.Auth
{
   // ── Request DTOs ──────────────────────────────────────────────────────────────
 
public record LoginRequestDto(
    string Email,
    string Password
);
 
public record RegisterRequestDto(
    string UserName,
    string FullName,
    string Email,
    string Password,
    string ConfirmPassword,
    string Role = "User"
);
 
// ── Response DTOs ─────────────────────────────────────────────────────────────
 
public record AuthResponseDto(
    bool   Success,
    string Message,
    string Token    = "",
    int    UserId   = 0,
    string FullName = "",
    string Email    = "",
    string Role     = ""
);

}