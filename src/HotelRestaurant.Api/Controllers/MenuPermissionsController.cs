using System.Security.Claims;
using HotelRestaurant.Api.Models;
using HotelRestaurant.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelRestaurant.Api.Controllers;

[ApiController]
[Route("api/menu-permissions")]
[Authorize]
public sealed class MenuPermissionsController : ControllerBase
{
    private static readonly string[] EditableRoles = ["Admin", "User"];
    private readonly AppDbContext _context;

    public MenuPermissionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("current")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentPermissions(CancellationToken cancellationToken)
    {
        if (User.IsInRole("SuperAdmin"))
        {
            var allRoutes = await _context.ApplicationMenus
                .AsNoTracking()
                .OrderBy(menu => menu.SortOrder)
                .Select(menu => menu.Route)
                .ToListAsync(cancellationToken);
            return Ok(allRoutes);
        }

        var roleName = GetRoleName();
        if (roleName is null || !EditableRoles.Contains(roleName, StringComparer.OrdinalIgnoreCase))
        {
            return Ok(Array.Empty<string>());
        }

        var routes = await _context.RoleMenuPermissions
            .AsNoTracking()
            .Where(permission => permission.RoleName == roleName)
            .OrderBy(permission => permission.Menu.SortOrder)
            .Select(permission => permission.Menu.Route)
            .ToListAsync(cancellationToken);

        return Ok(routes);
    }

    [HttpGet("navigation")]
    public async Task<ActionResult<IReadOnlyList<MenuPermissionOptionDto>>> GetNavigation(CancellationToken cancellationToken)
    {
        var menus = _context.ApplicationMenus.AsNoTracking();
        if (!User.IsInRole("SuperAdmin"))
        {
            var roleName = GetRoleName();
            if (roleName is null || !EditableRoles.Contains(roleName, StringComparer.OrdinalIgnoreCase))
            {
                return Ok(Array.Empty<MenuPermissionOptionDto>());
            }

            menus = menus.Where(menu => !menu.IsSuperAdminOnly && _context.RoleMenuPermissions
                .Any(permission => permission.RoleName == roleName && permission.MenuId == menu.Id));
        }

        var navigation = await menus
            .Where(menu => !menu.Route.Contains(":"))
            .OrderBy(menu => menu.SortOrder)
            .Select(menu => new MenuPermissionOptionDto(menu.Route, menu.Label, menu.Category, menu.SortOrder))
            .ToListAsync(cancellationToken);

        return Ok(navigation);
    }

    [HttpGet("catalog")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<MenuPermissionOptionDto>>> GetCatalog(CancellationToken cancellationToken)
    {
        var menus = await _context.ApplicationMenus
            .AsNoTracking()
            .Where(menu => !menu.IsSuperAdminOnly)
            .OrderBy(menu => menu.SortOrder)
            .Select(menu => new MenuPermissionOptionDto(menu.Route, menu.Label, menu.Category, menu.SortOrder))
            .ToListAsync(cancellationToken);

        return Ok(menus);
    }

    [HttpGet("roles/{roleName}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetRolePermissions(string roleName, CancellationToken cancellationToken)
    {
        if (!TryNormalizeEditableRole(roleName, out var normalizedRole))
        {
            return BadRequest(new { message = "Only Admin and User menu assignments can be edited." });
        }

        var routes = await _context.RoleMenuPermissions
            .AsNoTracking()
            .Where(permission => permission.RoleName == normalizedRole)
            .OrderBy(permission => permission.Menu.SortOrder)
            .Select(permission => permission.Menu.Route)
            .ToListAsync(cancellationToken);

        return Ok(routes);
    }

    [HttpPut("roles/{roleName}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> UpdateRolePermissions(
        string roleName,
        [FromBody] UpdateRoleMenuPermissionsRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryNormalizeEditableRole(roleName, out var normalizedRole))
        {
            return BadRequest(new { message = "Only Admin and User menu assignments can be edited." });
        }

        if (request.Routes is null || !request.Routes.Contains("dashboard", StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Dashboard must remain assigned as the role landing page." });
        }

        var routes = request.Routes.Distinct(StringComparer.OrdinalIgnoreCase).ToArray();
        var menus = await _context.ApplicationMenus
            .Where(menu => routes.Contains(menu.Route) && !menu.IsSuperAdminOnly)
            .ToListAsync(cancellationToken);

        if (menus.Count != routes.Length)
        {
            return BadRequest(new { message = "One or more selected menus are invalid." });
        }

        var current = await _context.RoleMenuPermissions
            .Where(permission => permission.RoleName == normalizedRole)
            .ToListAsync(cancellationToken);
        _context.RoleMenuPermissions.RemoveRange(current);
        _context.RoleMenuPermissions.AddRange(menus.Select(menu => new HotelRestaurant.Core.Entities.RoleMenuPermission
        {
            RoleName = normalizedRole,
            MenuId = menu.Id
        }));

        await _context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private string? GetRoleName()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
    }

    private static bool TryNormalizeEditableRole(string roleName, out string normalizedRole)
    {
        normalizedRole = EditableRoles.FirstOrDefault(role =>
            string.Equals(role, roleName, StringComparison.OrdinalIgnoreCase)) ?? string.Empty;
        return normalizedRole.Length > 0;
    }
}