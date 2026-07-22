using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMultiHotelIsolationNew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. SELF-HEALING: Clean up any half-created columns on these specific tables from previous crashed attempts
            migrationBuilder.Sql(@"
                DO $$ 
                DECLARE
                    t_name text;
                    tables text[] := ARRAY['BedTypes', 'ApplicationUsers', 'Amenities', 'AgentCommissions'];
                BEGIN
                    FOREACH t_name IN ARRAY tables LOOP
                        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t_name AND column_name = 'HotelId') THEN
                            EXECUTE format('ALTER TABLE public.%I DROP COLUMN ""HotelId"" CASCADE;', t_name);
                        END IF;
                    END LOOP;
                END $$;
            ");

            // 2. SEED DEFAULT HOTEL: Make sure Hotel 1 exists so foreign keys pass safely
            migrationBuilder.Sql(@"
                INSERT INTO public.""Hotels"" (""Id"", ""Name"", ""Address"", ""City"", ""Country"", ""Phone"", ""Email"", ""Rating"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"") 
                VALUES (1, 'Default Hotel', '123 Main St', 'City', 'Country', '123', 'default@hotel.com', 5.0, NOW(), NOW(), false)
                ON CONFLICT (""Id"") DO NOTHING;
            ");

            // 3. Drop existing FKs that EF core wants to replace
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Hotels_HotelId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_ReservationRooms_Hotels_HotelId",
                table: "ReservationRooms");

            // 4. Add columns using defaultValue: 1 so existing rows map to Hotel 1 instead of non-existent Hotel 0
            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "BedTypes",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "ApplicationUsers",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "Amenities",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HotelId",
                table: "AgentCommissions",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            // 5. Create Indexes
            migrationBuilder.CreateIndex(
                name: "IX_BedTypes_HotelId",
                table: "BedTypes",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUsers_HotelId",
                table: "ApplicationUsers",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_Amenities_HotelId",
                table: "Amenities",
                column: "HotelId");

            migrationBuilder.CreateIndex(
                name: "IX_AgentCommissions_HotelId",
                table: "AgentCommissions",
                column: "HotelId");

            // 6. Add Foreign Keys linking safely to Hotel 1
            migrationBuilder.AddForeignKey(
                name: "FK_AgentCommissions_Hotels_HotelId",
                table: "AgentCommissions",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Amenities_Hotels_HotelId",
                table: "Amenities",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUsers_Hotels_HotelId",
                table: "ApplicationUsers",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BedTypes_Hotels_HotelId",
                table: "BedTypes",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Hotels_HotelId",
                table: "Bookings",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationRooms_Hotels_HotelId",
                table: "ReservationRooms",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AgentCommissions_Hotels_HotelId",
                table: "AgentCommissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Amenities_Hotels_HotelId",
                table: "Amenities");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUsers_Hotels_HotelId",
                table: "ApplicationUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_BedTypes_Hotels_HotelId",
                table: "BedTypes");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_Hotels_HotelId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_ReservationRooms_Hotels_HotelId",
                table: "ReservationRooms");

            migrationBuilder.DropIndex(
                name: "IX_BedTypes_HotelId",
                table: "BedTypes");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationUsers_HotelId",
                table: "ApplicationUsers");

            migrationBuilder.DropIndex(
                name: "IX_Amenities_HotelId",
                table: "Amenities");

            migrationBuilder.DropIndex(
                name: "IX_AgentCommissions_HotelId",
                table: "AgentCommissions");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "BedTypes");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "ApplicationUsers");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "Amenities");

            migrationBuilder.DropColumn(
                name: "HotelId",
                table: "AgentCommissions");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_Hotels_HotelId",
                table: "Bookings",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ReservationRooms_Hotels_HotelId",
                table: "ReservationRooms",
                column: "HotelId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}