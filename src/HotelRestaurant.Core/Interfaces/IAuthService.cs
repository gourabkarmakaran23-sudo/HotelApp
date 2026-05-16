using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.DTOs.Auth;

namespace HotelRestaurant.Core.Interfaces
{
   /// <summary>
/// Authentication service contract — keeps the API controller thin.
/// </summary>
public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
}
 
}