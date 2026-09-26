using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddReportMenuEntries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
                        migrationBuilder.Sql("""
                                INSERT INTO "ApplicationMenus" ("Route", "Label", "Category", "SortOrder", "IsSuperAdminOnly") VALUES
                                ('reports/booking', 'Booking Report', 'Reports', 200, FALSE),
                                ('reports/monthly_summary', 'Monthly Summary Report', 'Reports', 210, FALSE),
                                ('reports/revenue', 'Revenue Report', 'Reports', 220, FALSE),
                                ('reports/transaction_rep', 'Transaction Report', 'Reports', 230, FALSE),
                                ('reports/payment_det', 'Payment Details Report', 'Reports', 240, FALSE),
                                ('reports/payment_sum', 'Payment Summary Report', 'Reports', 250, FALSE),
                                ('reports/daily_occupancy', 'Daily Room Occupancy', 'Reports', 260, FALSE),
                                ('reports/available_rooms', 'Available Room Report', 'Reports', 270, FALSE),
                                ('reports/checkout_rep', 'Room Checkout Report', 'Reports', 280, FALSE),
                                ('reports/today_occupancy', 'Today''s Occupancy', 'Reports', 290, FALSE),
                                ('reports/meal_alt', 'Meal Details Report', 'Reports', 300, FALSE);

                                INSERT INTO "RoleMenuPermissions" ("RoleName", "MenuId")
                                SELECT old_permission."RoleName", report_menu."Id"
                                FROM "RoleMenuPermissions" old_permission
                                JOIN "ApplicationMenus" old_menu ON old_menu."Id" = old_permission."MenuId"
                                CROSS JOIN "ApplicationMenus" report_menu
                                WHERE old_menu."Route" = 'reports/:reportType'
                                    AND report_menu."Category" = 'Reports'
                                    AND report_menu."Route" LIKE 'reports/%'
                                ON CONFLICT ("RoleName", "MenuId") DO NOTHING;

                                DELETE FROM "RoleMenuPermissions" permission
                                USING "ApplicationMenus" menu
                                WHERE permission."MenuId" = menu."Id"
                                    AND menu."Route" = 'reports/:reportType';

                                DELETE FROM "ApplicationMenus" WHERE "Route" = 'reports/:reportType';
                                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
                        migrationBuilder.Sql("""
                                INSERT INTO "ApplicationMenus" ("Route", "Label", "Category", "SortOrder", "IsSuperAdminOnly")
                                VALUES ('reports/:reportType', 'Reports Panel', 'Reports', 200, FALSE);

                                INSERT INTO "RoleMenuPermissions" ("RoleName", "MenuId")
                                SELECT DISTINCT permission."RoleName", menu."Id"
                                FROM "RoleMenuPermissions" permission
                                JOIN "ApplicationMenus" report_menu ON report_menu."Id" = permission."MenuId"
                                JOIN "ApplicationMenus" menu ON menu."Route" = 'reports/:reportType'
                                WHERE report_menu."Route" LIKE 'reports/%';

                                DELETE FROM "RoleMenuPermissions" permission
                                USING "ApplicationMenus" menu
                                WHERE permission."MenuId" = menu."Id"
                                    AND menu."Route" LIKE 'reports/%'
                                    AND menu."Route" <> 'reports/:reportType';

                                DELETE FROM "ApplicationMenus"
                                WHERE "Route" LIKE 'reports/%' AND "Route" <> 'reports/:reportType';
                                """);
        }
    }
}
