using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyAndHotelSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUsers_Hotels_HotelId",
                table: "ApplicationUsers");

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Hotels",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "ApplicationUsers",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    LegalRegistrationNumber = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.Sql(@"
                INSERT INTO ""Companies"" (""Id"", ""Name"", ""LegalRegistrationNumber"", ""Address"", ""City"", ""Country"", ""Phone"", ""Email"", ""IsActive"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"")
                VALUES (1, 'Azure Group', 'REG-AZ-1001', '10 Corporate Avenue', 'Harmony', 'Utopia', '+1-555-0001', 'admin@azuregroup.example', TRUE, NOW(), NOW(), FALSE)
                ON CONFLICT (""Id"") DO NOTHING;

                UPDATE ""Hotels"" SET ""CompanyId"" = 1 WHERE ""CompanyId"" = 0;
                UPDATE ""ApplicationUsers"" SET ""CompanyId"" = 1 WHERE ""CompanyId"" = 0;
                SELECT setval(pg_get_serial_sequence('""Companies""', 'Id'), GREATEST((SELECT MAX(""Id"") FROM ""Companies""), 1), TRUE);
            ");

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_CompanyId",
                table: "Hotels",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUsers_CompanyId",
                table: "ApplicationUsers",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUsers_Companies_CompanyId",
                table: "ApplicationUsers",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUsers_Hotels_HotelId",
                table: "ApplicationUsers",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Companies_CompanyId",
                table: "Hotels",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUsers_Companies_CompanyId",
                table: "ApplicationUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUsers_Hotels_HotelId",
                table: "ApplicationUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Companies_CompanyId",
                table: "Hotels");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_CompanyId",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationUsers_CompanyId",
                table: "ApplicationUsers");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "ApplicationUsers");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUsers_Hotels_HotelId",
                table: "ApplicationUsers",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
