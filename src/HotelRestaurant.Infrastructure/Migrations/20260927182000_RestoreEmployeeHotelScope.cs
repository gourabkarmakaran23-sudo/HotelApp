using HotelRestaurant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260927182000_RestoreEmployeeHotelScope")]
    public partial class RestoreEmployeeHotelScope : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "Employees",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_HotelId",
                table: "Employees",
                column: "HotelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Hotels_HotelId",
                table: "Employees",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Hotels_HotelId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_HotelId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "Employees");
        }
    }
}