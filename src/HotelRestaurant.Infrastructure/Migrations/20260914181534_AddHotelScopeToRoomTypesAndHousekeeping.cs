using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHotelScopeToRoomTypesAndHousekeeping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "RoomTypes",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "roomcleanings",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "LaundryPayments",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "LaundryLogs",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "HouseKeepingChecklists",
                type: "integer",
                nullable: false,
                defaultValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "RoomTypes");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "roomcleanings");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "LaundryPayments");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "LaundryLogs");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "HouseKeepingChecklists");
        }
    }
}
