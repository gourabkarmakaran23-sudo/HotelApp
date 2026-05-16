using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Core.Interfaces
{/// <summary>
 /// JWT service abstraction — Dependency Inversion keeps Core free of infrastructure deps.
 /// </summary>
    public interface IJwtService
    {
        string GenerateToken(ApplicationUser user);
    }

}