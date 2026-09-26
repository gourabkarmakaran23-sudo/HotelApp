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
            return ApplyTenantScope(_dbSet.AsQueryable());
        }
        public async Task AddAsync(T entity)
        {
            var hotelIdProperty = typeof(T).GetProperty(nameof(IMultiHotelEntity.HotelId));
            var activeHotelId = ResolveActiveHotelId();
            if (hotelIdProperty?.PropertyType == typeof(int) && activeHotelId.HasValue)
            {
                hotelIdProperty.SetValue(entity, activeHotelId.Value);
            }

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
            var query = ApplyTenantScope(_dbSet.AsQueryable());
            return await query.Where(predicate).ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await ApplyTenantScope(_dbSet.AsQueryable()).ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity is null) return null;

            var hotelIdProperty = typeof(T).GetProperty(nameof(IMultiHotelEntity.HotelId));
            if (hotelIdProperty?.PropertyType == typeof(int))
            {
                var activeHotelId = ResolveActiveHotelId();
                if (activeHotelId.HasValue && (int)hotelIdProperty.GetValue(entity)! != activeHotelId.Value)
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
           
            IQueryable<T> query = ApplyTenantScope(_dbSet.AsQueryable());

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

        private IQueryable<T> ApplyTenantScope(IQueryable<T> query)
        {
            var hotelIdInfo = typeof(T).GetProperty(nameof(IMultiHotelEntity.HotelId));
            if (hotelIdInfo?.PropertyType == typeof(int))
            {
                var activeHotelId = ResolveActiveHotelId();
                if (activeHotelId.HasValue)
                {
                    query = query.Where(BuildEqualsExpression(hotelIdInfo, activeHotelId.Value));
                }
            }

            var companyIdInfo = typeof(T).GetProperty(nameof(IMultiCompanyEntity.CompanyId));
            if (companyIdInfo?.PropertyType != typeof(int))
            {
                return query;
            }

            var activeCompanyId = ResolveActiveCompanyId();
            return activeCompanyId.HasValue
                ? query.Where(BuildEqualsExpression(companyIdInfo, activeCompanyId.Value))
                : query;
        }

        private static Expression<Func<T, bool>> BuildEqualsExpression(
            System.Reflection.PropertyInfo propertyInfo,
            int value)
        {
            var parameter = Expression.Parameter(typeof(T), "entity");
            var property = Expression.Property(parameter, propertyInfo);
            var equalsExpression = Expression.Equal(property, Expression.Constant(value));
            return Expression.Lambda<Func<T, bool>>(equalsExpression, parameter);
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

            var isSuperAdmin = string.Equals(role, "SuperAdmin", StringComparison.OrdinalIgnoreCase);

            if (isSuperAdmin &&
                string.Equals(canViewAllHotels, "true", StringComparison.OrdinalIgnoreCase))
            {
                if (int.TryParse(headerHotelId, out var selectedHotelId))
                {
                    return selectedHotelId;
                }

                return null;
            }

            if (int.TryParse(claimHotelId, out var parsedClaimHotelId))
            {
                return parsedClaimHotelId;
            }

            return null;
        }

        private int? ResolveActiveCompanyId()
        {
            if (_httpContextAccessor?.HttpContext is null)
            {
                return null;
            }

            var role = _httpContextAccessor.HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var canViewAllHotels = _httpContextAccessor.HttpContext.User.FindFirst("can_view_all_hotels")?.Value;
            var headerCompanyId = _httpContextAccessor.HttpContext.Request.Headers["X-Company-Id"].FirstOrDefault();
            var claimCompanyId = _httpContextAccessor.HttpContext.User.FindFirst("company_id")?.Value;

            if (string.Equals(role, "SuperAdmin", StringComparison.OrdinalIgnoreCase) &&
                string.Equals(canViewAllHotels, "true", StringComparison.OrdinalIgnoreCase))
            {
                return int.TryParse(headerCompanyId, out var selectedCompanyId)
                    ? selectedCompanyId
                    : null;
            }

            return int.TryParse(claimCompanyId, out var assignedCompanyId)
                ? assignedCompanyId
                : null;
        }
    }
}
