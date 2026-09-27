using HotelRestaurant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260927181000_AddEmployeeManagementMenu")]
    public partial class AddEmployeeManagementMenu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO "ApplicationMenus" ("Route", "Label", "Category", "SortOrder", "IsSuperAdminOnly")
                VALUES ('employees', 'Employees', 'Room Settings', 670, FALSE)
                ON CONFLICT ("Route") DO NOTHING;

                INSERT INTO "RoleMenuPermissions" ("RoleName", "MenuId")
                SELECT roles."RoleName", menu."Id"
                FROM (VALUES ('Admin'), ('User')) AS roles("RoleName")
                CROSS JOIN "ApplicationMenus" menu
                WHERE menu."Route" = 'employees'
                  AND NOT EXISTS (
                    SELECT 1 FROM "RoleMenuPermissions" permission
                    WHERE permission."RoleName" = roles."RoleName"
                      AND permission."MenuId" = menu."Id");
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM "RoleMenuPermissions"
                WHERE "MenuId" IN (SELECT "Id" FROM "ApplicationMenus" WHERE "Route" = 'employees');
                DELETE FROM "ApplicationMenus" WHERE "Route" = 'employees';
                """);
        }
    }
}