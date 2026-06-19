using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFloorAndRoomTypeToRooms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_RoomTypes_RoomTypesId",
                table: "Rooms");

            migrationBuilder.RenameColumn(
                name: "RoomType",
                table: "Rooms",
                newName: "FloorNo");

            migrationBuilder.AlterColumn<int>(
                name: "RoomTypesId",
                table: "Rooms",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_RoomTypes_RoomTypesId",
                table: "Rooms",
                column: "RoomTypesId",
                principalTable: "RoomTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_RoomTypes_RoomTypesId",
                table: "Rooms");

            migrationBuilder.RenameColumn(
                name: "FloorNo",
                table: "Rooms",
                newName: "RoomType");

            migrationBuilder.AlterColumn<int>(
                name: "RoomTypesId",
                table: "Rooms",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_RoomTypes_RoomTypesId",
                table: "Rooms",
                column: "RoomTypesId",
                principalTable: "RoomTypes",
                principalColumn: "Id");
        }
    }
}
