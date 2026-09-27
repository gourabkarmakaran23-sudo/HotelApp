using HotelRestaurant.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260927180000_AddBookingEngineLookupTables")]
    public partial class AddBookingEngineLookupTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookingReferenceOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", Npgsql.EntityFrameworkCore.PostgreSQL.Metadata.NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ReferenceName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_BookingReferenceOptions", x => x.Id));

            migrationBuilder.CreateTable(
                name: "GuestTitles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", Npgsql.EntityFrameworkCore.PostgreSQL.Metadata.NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TitleName = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table => table.PrimaryKey("PK_GuestTitles", x => x.Id));

            migrationBuilder.Sql("""
                INSERT INTO "BookingReferenceOptions" ("ReferenceName", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted")
                VALUES
                    ('Head Back Office', TRUE, TIMESTAMP '2026-09-27 00:00:00', TIMESTAMP '2026-09-27 00:00:00', FALSE),
                    ('Kolkata Back Office', TRUE, TIMESTAMP '2026-09-27 00:00:00', TIMESTAMP '2026-09-27 00:00:00', FALSE);

                INSERT INTO "GuestTitles" ("TitleName", "IsActive", "CreatedAt", "UpdatedAt", "IsDeleted")
                VALUES
                    ('Mr.', TRUE, TIMESTAMP '2026-09-27 00:00:00', TIMESTAMP '2026-09-27 00:00:00', FALSE),
                    ('Ms.', TRUE, TIMESTAMP '2026-09-27 00:00:00', TIMESTAMP '2026-09-27 00:00:00', FALSE),
                    ('Mrs.', TRUE, TIMESTAMP '2026-09-27 00:00:00', TIMESTAMP '2026-09-27 00:00:00', FALSE),
                    ('M/s', TRUE, TIMESTAMP '2026-09-27 00:00:00', TIMESTAMP '2026-09-27 00:00:00', FALSE),
                    ('Dr.', TRUE, TIMESTAMP '2026-09-27 00:00:00', TIMESTAMP '2026-09-27 00:00:00', FALSE),
                    ('Prof.', TRUE, TIMESTAMP '2026-09-27 00:00:00', TIMESTAMP '2026-09-27 00:00:00', FALSE);
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "BookingReferenceOptions");
            migrationBuilder.DropTable(name: "GuestTitles");
        }
    }
}