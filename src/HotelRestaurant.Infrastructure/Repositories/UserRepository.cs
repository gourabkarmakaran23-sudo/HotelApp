using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelRestaurant.Infrastructure.Repositories
{
  /// <summary>
/// User-specific repository — extends generic with auth queries.
/// Single Responsibility: handles only user persistence concerns.
/// </summary>
public class UserRepository : GenericRepository<ApplicationUser>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }
 
      public async Task<ApplicationUser?> GetByEmailAsync(string email)
        => await _dbSet
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
 
    public async Task<bool> EmailExistsAsync(string email)
        => await _dbSet
            .AnyAsync(u => u.Email.ToLower() == email.ToLower());
}
}