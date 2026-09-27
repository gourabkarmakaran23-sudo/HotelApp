using HotelRestaurant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260927183000_MoveEmployeesMenuToMasters")]
    public partial class MoveEmployeesMenuToMasters : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "ApplicationMenus"
                SET "Category" = 'Masters', "SortOrder" = 420
                WHERE "Route" = 'employees';
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "ApplicationMenus"
                SET "Category" = 'Room Settings', "SortOrder" = 670
                WHERE "Route" = 'employees';
                """);
        }
    }
}