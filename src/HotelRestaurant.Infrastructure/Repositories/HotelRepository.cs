using Microsoft.EntityFrameworkCore;
using HotelRestaurant.Core.Entities;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Infrastructure.Data;

namespace HotelRestaurant.Infrastructure.Repositories
{
    public class HotelRepository : IHotelRepository
    {
        private readonly AppDbContext _context;

        public HotelRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Hotel>> GetLookupAsync()
        {
            return await _context.Hotels
                .Where(h => !h.IsDeleted)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Hotel>> GetAllAsync()
        {
            return await _context.Hotels
                .Where(h => !h.IsDeleted)
                .ToListAsync();
        }

        public async Task<Hotel?> GetByIdAsync(int id)
        {
            return await _context.Hotels
                .FirstOrDefaultAsync(h => h.Id == id && !h.IsDeleted);
        }

        public async Task AddAsync(Hotel hotel)
        {
            await _context.Hotels.AddAsync(hotel);
        }

        public void Update(Hotel hotel)
        {
            _context.Hotels.Update(hotel);
        }

        public void Delete(Hotel hotel)
        {
            hotel.IsDeleted = true; // Soft Delete
            _context.Hotels.Update(hotel);
        }
    }
}