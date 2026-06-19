using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddChildAgeToReservationRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChildAge",
                table: "ReservationRooms",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ComplimentaryNight",
                table: "ReservationRooms",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ExtraChildCharge",
                table: "ReservationRooms",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RentPerNight",
                table: "ReservationRooms",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChildAge",
                table: "ReservationRooms");

            migrationBuilder.DropColumn(
                name: "ComplimentaryNight",
                table: "ReservationRooms");

            migrationBuilder.DropColumn(
                name: "ExtraChildCharge",
                table: "ReservationRooms");

            migrationBuilder.DropColumn(
                name: "RentPerNight",
                table: "ReservationRooms");
        }
    }
}
