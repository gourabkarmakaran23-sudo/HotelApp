using System.Linq.Expressions;
using HotelRestaurant.Core.Interfaces;
using HotelRestaurant.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace HotelRestaurant.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;
        private readonly IHttpContextAccessor? _httpContextAccessor;

        public GenericRepository(AppDbContext context, IHttpContextAccessor? httpContextAccessor = null)
        {
            _context = context;
            _dbSet = context.Set<T>();
            _httpContextAccessor = httpContextAccessor;
        }

        public IQueryable<T> GetAllQueryable()
        {
            return ApplyHotelScope(_dbSet.AsQueryable());
        }
        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            var query = ApplyHotelScope(_dbSet.AsQueryable());
            return await query.Where(predicate).ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await ApplyHotelScope(_dbSet.AsQueryable()).ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity is null) return null;

            if (entity is IMultiHotelEntity multiHotelEntity)
            {
                var activeHotelId = ResolveActiveHotelId();
                if (activeHotelId.HasValue && multiHotelEntity.HotelId != activeHotelId.Value)
                {
                    return null;
                }
            }

            return entity;
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void DeleteRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                _dbSet.Remove(entity);
            }
        }

        public virtual async Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
            int pageNumber,
            int pageSize,
            Expression<Func<T, bool>>? filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>>? orderBy = null,
            Func<IQueryable<T>, IQueryable<T>>? include = null,
            CancellationToken cancellationToken = default)
        {
           
            IQueryable<T> query = ApplyHotelScope(_dbSet.AsQueryable());

            if (filter != null)
            {
                query = query.Where(filter);        
            }
            if (include != null)
            {
                query = include(query);
            }
            int totalCount=await query.CountAsync(cancellationToken);
            if (orderBy != null)
            {
                query = orderBy(query);
            }

            var items= await query.Skip((pageNumber - 1) * pageSize).
            Take(pageSize).ToListAsync(cancellationToken);
            return (items,totalCount) ;
        }

        private IQueryable<T> ApplyHotelScope(IQueryable<T> query)
        {
            if (!typeof(IMultiHotelEntity).IsAssignableFrom(typeof(T)))
            {
                return query;
            }

            var activeHotelId = ResolveActiveHotelId();
            if (!activeHotelId.HasValue)
            {
                return query;
            }

            var parameter = Expression.Parameter(typeof(T), "entity");
            var hotelIdProperty = Expression.Property(parameter, nameof(IMultiHotelEntity.HotelId));
            var constant = Expression.Constant(activeHotelId.Value);
            var equalsExpression = Expression.Equal(hotelIdProperty, constant);
            var lambda = Expression.Lambda<Func<T, bool>>(equalsExpression, parameter);

            return query.Where(lambda);
        }

        private int? ResolveActiveHotelId()
        {
            if (_httpContextAccessor?.HttpContext is null)
            {
                return null;
            }

            var role = _httpContextAccessor.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var canViewAllHotels = _httpContextAccessor.HttpContext.User.FindFirst("can_view_all_hotels")?.Value;
            var headerHotelId = _httpContextAccessor.HttpContext.Request.Headers["X-Hotel-Id"].FirstOrDefault();
            var claimHotelId = _httpContextAccessor.HttpContext.User.FindFirst("hotel_id")?.Value;

            var isCrossHotelRole = string.Equals(role, "SuperAdmin", StringComparison.OrdinalIgnoreCase)
                || string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase);

            if (isCrossHotelRole &&
                string.Equals(canViewAllHotels, "true", StringComparison.OrdinalIgnoreCase) &&
                string.IsNullOrWhiteSpace(headerHotelId))
            {
                return null;
            }

            if (int.TryParse(headerHotelId, out var parsedHeaderHotelId))
            {
                return parsedHeaderHotelId;
            }

            if (int.TryParse(claimHotelId, out var parsedClaimHotelId))
            {
                return parsedClaimHotelId;
            }

            return null;
        }
    }
}
