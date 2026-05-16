using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Entities;

namespace HotelRestaurant.Core.Interfaces
{
    /// <summary>
/// User-specific repository — extends generic contract with auth queries.
/// Dependency Inversion: upper layers depend on this abstraction, not EF Core.
/// </summary>
public interface IUserRepository : IGenericRepository<ApplicationUser>
{
    Task<ApplicationUser?> GetByEmailAsync(string email);
    Task<bool>  EmailExistsAsync(string email);
}
}