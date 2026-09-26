using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class BackfillHotelScopeDefaults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"RoomTypes\" SET \"HotelId\" = 1 WHERE \"HotelId\" = 0;");
            migrationBuilder.Sql("UPDATE roomcleanings SET \"HotelId\" = 1 WHERE \"HotelId\" = 0;");
            migrationBuilder.Sql("UPDATE \"LaundryPayments\" SET \"HotelId\" = 1 WHERE \"HotelId\" = 0;");
            migrationBuilder.Sql("UPDATE \"LaundryLogs\" SET \"HotelId\" = 1 WHERE \"HotelId\" = 0;");
            migrationBuilder.Sql("UPDATE \"HouseKeepingChecklists\" SET \"HotelId\" = 1 WHERE \"HotelId\" = 0;");

            migrationBuilder.Sql("ALTER TABLE \"RoomTypes\" ALTER COLUMN \"HotelId\" SET DEFAULT 1;");
            migrationBuilder.Sql("ALTER TABLE roomcleanings ALTER COLUMN \"HotelId\" SET DEFAULT 1;");
            migrationBuilder.Sql("ALTER TABLE \"LaundryPayments\" ALTER COLUMN \"HotelId\" SET DEFAULT 1;");
            migrationBuilder.Sql("ALTER TABLE \"LaundryLogs\" ALTER COLUMN \"HotelId\" SET DEFAULT 1;");
            migrationBuilder.Sql("ALTER TABLE \"HouseKeepingChecklists\" ALTER COLUMN \"HotelId\" SET DEFAULT 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
