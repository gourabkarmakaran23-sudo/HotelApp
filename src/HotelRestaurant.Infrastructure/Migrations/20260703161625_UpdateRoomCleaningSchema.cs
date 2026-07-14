using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRoomCleaningSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HouseKeepingChecklists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TaskName = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HouseKeepingChecklists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LaundryLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InvoiceNo = table.Column<string>(type: "text", nullable: false),
                    LaundryName = table.Column<string>(type: "text", nullable: false),
                    ItemName = table.Column<string>(type: "text", nullable: false),
                    OperateBy = table.Column<string>(type: "text", nullable: false),
                    TaskName = table.Column<string>(type: "text", nullable: false),
                    ItemCost = table.Column<decimal>(type: "numeric", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    SendDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    ReceivedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    PaymentStatus = table.Column<string>(type: "text", nullable: false),
                    Comments = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LaundryLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LaundryPayments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    InvoiceNo = table.Column<string>(type: "text", nullable: false),
                    LaundryName = table.Column<string>(type: "text", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    DueAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    PaidAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LaundryPayments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "roomcleanings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    RoomNo = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roomcleanings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HouseKeepingChecklists");

            migrationBuilder.DropTable(
                name: "LaundryLogs");

            migrationBuilder.DropTable(
                name: "LaundryPayments");

            migrationBuilder.DropTable(
                name: "roomcleanings");
        }
    }
}
