using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryFieldsToLaundryLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "InLaundry",
                table: "LaundryLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "InUse",
                table: "LaundryLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Ready",
                table: "LaundryLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InLaundry",
                table: "LaundryLogs");

            migrationBuilder.DropColumn(
                name: "InUse",
                table: "LaundryLogs");

            migrationBuilder.DropColumn(
                name: "Ready",
                table: "LaundryLogs");
        }
    }
}
