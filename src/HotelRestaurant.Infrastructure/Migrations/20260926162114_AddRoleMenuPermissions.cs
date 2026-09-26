using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleMenuPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationMenus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Route = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Label = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsSuperAdminOnly = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationMenus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoleMenuPermissions",
                columns: table => new
                {
                    RoleName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    MenuId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleMenuPermissions", x => new { x.RoleName, x.MenuId });
                    table.ForeignKey(
                        name: "FK_RoleMenuPermissions_ApplicationMenus_MenuId",
                        column: x => x.MenuId,
                        principalTable: "ApplicationMenus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationMenus_Route",
                table: "ApplicationMenus",
                column: "Route",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoleMenuPermissions_MenuId",
                table: "RoleMenuPermissions",
                column: "MenuId");

            migrationBuilder.Sql("""
                INSERT INTO "ApplicationMenus" ("Route", "Label", "Category", "SortOrder", "IsSuperAdminOnly") VALUES
                ('dashboard', 'Dashboard', 'General', 10, FALSE),
                ('dashboard2', 'Portfolio Overview', 'Super Admin', 20, TRUE),
                ('companies', 'Companies', 'Super Admin', 30, TRUE),
                ('hotels', 'Hotels', 'Super Admin', 40, TRUE),
                ('admin/menu-rights', 'Menu Rights', 'Super Admin', 50, TRUE),
                ('booking-list', 'Booking List', 'Reservations', 100, FALSE),
                ('booking-engine', 'Booking Engine', 'Reservations', 110, FALSE),
                ('checkin', 'Check In', 'Reservations', 120, FALSE),
                ('checkout', 'Checkout', 'Reservations', 130, FALSE),
                ('direct-checkout', 'Direct Checkout', 'Reservations', 140, FALSE),
                ('room-status', 'Room Status', 'Reservations', 150, FALSE),
                ('upcoming-checkin', 'Upcoming CheckIn', 'Reservations', 160, FALSE),
                ('add-guest', 'Add Guest', 'Reservations', 170, FALSE),
                ('guest/:id', 'Guest Details', 'Reservations', 180, FALSE),
                ('payment-list/:id', 'Booking Payment', 'Reservations', 190, FALSE),
                ('reports/:reportType', 'Reports Panel', 'Reports', 200, FALSE),
                ('currencies', 'Currency', 'Masters', 300, FALSE),
                ('payment-methods', 'Payment Methods', 'Masters', 310, FALSE),
                ('commission-agents', 'Commission Agents', 'Masters', 320, FALSE),
                ('agent-commissions', 'Agent Commissions', 'Masters', 330, FALSE),
                ('financial-years', 'Financial Years', 'Masters', 340, FALSE),
                ('wake-up-calls', 'Wake Up Calls', 'Masters', 350, FALSE),
                ('purchase', 'Purchase Items', 'Masters', 360, FALSE),
                ('purchase-returns', 'Purchase Returns', 'Masters', 370, FALSE),
                ('stock-report', 'Stock Report', 'Masters', 380, FALSE),
                ('stock-details', 'Stock Details', 'Masters', 390, FALSE),
                ('tax/list', 'Tax List Config', 'Masters', 400, FALSE),
                ('promos/list', 'Promocode Matrix', 'Masters', 410, FALSE),
                ('room-types', 'Room Types', 'Room Types', 500, FALSE),
                ('rooms', 'Rooms', 'Operations', 510, FALSE),
                ('payment', 'Payment Setting', 'Payments', 520, FALSE),
                ('payment/other-list', 'Other Payment List', 'Payments', 530, FALSE),
                ('payment/other-entry', 'Other Payment Entry', 'Payments', 540, FALSE),
                ('payment/other-entry/:id', 'Edit Other Payment', 'Payments', 550, FALSE),
                ('booking-type', 'Booking Type', 'Room Settings', 600, FALSE),
                ('booking-source', 'Booking Source', 'Room Settings', 610, FALSE),
                ('bed-type', 'Bed Type', 'Room Settings', 620, FALSE),
                ('floor-plan', 'Floor Plan', 'Room Settings', 630, FALSE),
                ('complementary', 'Complementary', 'Room Settings', 640, FALSE),
                ('amenities', 'Amenities Management', 'Room Settings', 650, FALSE),
                ('cancellation-policy', 'Cancellation Policy', 'Room Settings', 660, FALSE),
                ('account/financial-year-end', 'Financial Year Ending', 'Accounting', 700, FALSE),
                ('account/chart-of-accounts', 'Chart of Account', 'Accounting', 710, FALSE),
                ('account/opening-balance', 'Opening Balance', 'Accounting', 720, FALSE),
                ('account/debit-voucher', 'Debit Voucher', 'Accounting', 730, FALSE),
                ('account/credit-voucher', 'Credit Voucher', 'Accounting', 740, FALSE),
                ('account/contra-voucher', 'Contra Voucher', 'Accounting', 750, FALSE),
                ('account/journal-voucher', 'Journal Voucher', 'Accounting', 760, FALSE),
                ('account/voucher-approval', 'Voucher Approval', 'Accounting', 770, FALSE),
                ('account/voucher-report', 'Voucher Report', 'Accounting', 780, FALSE),
                ('account/cash-book', 'Cash Book', 'Accounting', 790, FALSE),
                ('account/bank-book', 'Bank Book', 'Accounting', 800, FALSE),
                ('account/general-ledger', 'General Ledger', 'Accounting', 810, FALSE),
                ('account/trial-balance', 'Trial Balance', 'Accounting', 820, FALSE),
                ('account/profit-loss', 'Profit & Loss', 'Accounting', 830, FALSE),
                ('account/coa-print', 'Chart of Account Print', 'Accounting', 840, FALSE),
                ('account/balance-sheet', 'Balance Sheet', 'Accounting', 850, FALSE),
                ('housekeeping/assign-room-cleaning', 'Assign Room Cleaning', 'Housekeeping', 900, FALSE),
                ('housekeeping/room-cleaning', 'Room Cleaning', 'Housekeeping', 910, FALSE),
                ('housekeeping/checklist', 'Checklist', 'Housekeeping', 920, FALSE),
                ('housekeeping/room-qrcode', 'Room QR Code', 'Housekeeping', 930, FALSE),
                ('housekeeping/product-laundry', 'Laundry Products', 'Housekeeping', 940, FALSE),
                ('housekeeping/laundry', 'Laundry', 'Housekeeping', 950, FALSE),
                ('housekeeping/payment-record', 'Laundry Payment', 'Housekeeping', 960, FALSE),
                ('cancellation/refund-due', 'Refund Due', 'Payments', 970, FALSE),
                ('cancellation/refund-process', 'Refund Process', 'Payments', 980, FALSE),
                ('cancellation/refunded-archive', 'Refunded Archive', 'Payments', 990, FALSE);

                INSERT INTO "RoleMenuPermissions" ("RoleName", "MenuId")
                SELECT 'Admin', "Id" FROM "ApplicationMenus" WHERE NOT "IsSuperAdminOnly";

                INSERT INTO "RoleMenuPermissions" ("RoleName", "MenuId")
                SELECT 'User', "Id" FROM "ApplicationMenus"
                WHERE "Route" = 'dashboard'
                   OR "Category" IN ('Reports', 'Masters', 'Room Types', 'Room Settings', 'Accounting');
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoleMenuPermissions");

            migrationBuilder.DropTable(
                name: "ApplicationMenus");
        }
    }
}
