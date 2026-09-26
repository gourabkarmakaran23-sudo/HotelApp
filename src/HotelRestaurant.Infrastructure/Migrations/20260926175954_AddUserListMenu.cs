using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserListMenu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO "ApplicationMenus" ("Route", "Label", "Category", "SortOrder", "IsSuperAdminOnly")
                VALUES ('admin/users', 'User List', 'Super Admin', 55, TRUE)
                ON CONFLICT ("Route") DO NOTHING;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM "ApplicationMenus" WHERE "Route" = 'admin/users';
                """);
        }
    }
}
