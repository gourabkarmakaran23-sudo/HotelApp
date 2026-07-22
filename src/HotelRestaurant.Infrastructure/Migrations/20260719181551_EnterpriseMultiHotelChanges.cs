
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnterpriseMultiHotelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. SELF-HEALING: Clean up lingering HotelId columns from previous failed attempts so Postgres starts completely fresh
            migrationBuilder.Sql(@"
                DO $$ 
                DECLARE
                    t_name text;
                BEGIN
                    FOR t_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') LOOP
                        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t_name AND column_name = 'HotelId') THEN
                            EXECUTE format('ALTER TABLE public.%I DROP COLUMN ""HotelId"" CASCADE;', t_name);
                        END IF;
                    END LOOP;
                END $$;
            ");

            // 2. SEED DEFAULT HOTEL: Providing NOW() for both CreatedAt and UpdatedAt to satisfy the NOT NULL constraints
            migrationBuilder.Sql(@"
                INSERT INTO public.""Hotels"" (""Id"", ""Name"", ""Address"", ""City"", ""Country"", ""Phone"", ""Email"", ""Rating"", ""CreatedAt"", ""UpdatedAt"", ""IsDeleted"") 
                VALUES (1, 'Default Hotel', '123 Main St', 'City', 'Country', '123', 'default@hotel.com', 5.0, NOW(), NOW(), false)
                ON CONFLICT (""Id"") DO NOTHING;
            ");

            // 3. ADD HOTEL ID TO TABLES: Set default value to 1 to match the default hotel record
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Rooms", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "WakeUpCalls", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Taxes", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Tariff", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "RoomTypeFacility", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "RoomFacility", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "ReservationRooms", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Reservation", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "RefundRecords", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "PurchaseReturns", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "PurchaseItems", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Promocodes", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Payments", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "PaymentMethods", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "OtherPaymentInvoices", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "OtherPaymentInvoiceItems", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Orders", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "OrderItems", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "OpeningBalances", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "MenuItems", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Invoices", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "InventoryItems", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Guests", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "FloorPlans", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "FinancialYears", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Currencies", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Complementaries", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "CommissionAgents", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "CancellationPolicies", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "BookingTypes", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "BookingSources", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "Bookings", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "BookingGuests", type: "integer", nullable: false, defaultValue: 1);
            migrationBuilder.AddColumn<int>(name: "HotelId", table: "BookingDocuments", type: "integer", nullable: false, defaultValue: 1);

            // 4. CREATE INDEXES
            migrationBuilder.CreateIndex(name: "IX_Rooms_HotelId", table: "Rooms", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_WakeUpCalls_HotelId", table: "WakeUpCalls", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Taxes_HotelId", table: "Taxes", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Tariff_HotelId", table: "Tariff", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_RoomTypeFacility_HotelId", table: "RoomTypeFacility", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_RoomFacility_HotelId", table: "RoomFacility", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_ReservationRooms_HotelId", table: "ReservationRooms", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Reservation_HotelId", table: "Reservation", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_RefundRecords_HotelId", table: "RefundRecords", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_PurchaseReturns_HotelId", table: "PurchaseReturns", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_PurchaseItems_HotelId", table: "PurchaseItems", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Promocodes_HotelId", table: "Promocodes", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Payments_HotelId", table: "Payments", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_PaymentMethods_HotelId", table: "PaymentMethods", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_OtherPaymentInvoices_HotelId", table: "OtherPaymentInvoices", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_OtherPaymentInvoiceItems_HotelId", table: "OtherPaymentInvoiceItems", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Orders_HotelId", table: "Orders", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_OrderItems_HotelId", table: "OrderItems", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_OpeningBalances_HotelId", table: "OpeningBalances", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_MenuItems_HotelId", table: "MenuItems", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Invoices_HotelId", table: "Invoices", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_InventoryItems_HotelId", table: "InventoryItems", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Guests_HotelId", table: "Guests", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_FloorPlans_HotelId", table: "FloorPlans", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_FinancialYears_HotelId", table: "FinancialYears", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Currencies_HotelId", table: "Currencies", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Complementaries_HotelId", table: "Complementaries", column: "HotelId");
            migrationBuilder.CreateIndex(name: "IX_Bookings_HotelId", table: "Bookings", column: "HotelId");

            // 5. ESTABLISH FOREIGN KEY CONSTRAINTS
            migrationBuilder.AddForeignKey(name: "FK_Rooms_Hotels_HotelId", table: "Rooms", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Bookings_Hotels_HotelId", table: "Bookings", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(name: "FK_Complementaries_Hotels_HotelId", table: "Complementaries", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Currencies_Hotels_HotelId", table: "Currencies", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_FinancialYears_Hotels_HotelId", table: "FinancialYears", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_FloorPlans_Hotels_HotelId", table: "FloorPlans", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Guests_Hotels_HotelId", table: "Guests", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_InventoryItems_Hotels_HotelId", table: "InventoryItems", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Invoices_Hotels_HotelId", table: "Invoices", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_MenuItems_Hotels_HotelId", table: "MenuItems", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_OpeningBalances_Hotels_HotelId", table: "OpeningBalances", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_OrderItems_Hotels_HotelId", table: "OrderItems", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Orders_Hotels_HotelId", table: "Orders", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_OtherPaymentInvoiceItems_Hotels_HotelId", table: "OtherPaymentInvoiceItems", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_OtherPaymentInvoices_Hotels_HotelId", table: "OtherPaymentInvoices", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_PaymentMethods_Hotels_HotelId", table: "PaymentMethods", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Payments_Hotels_HotelId", table: "Payments", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Promocodes_Hotels_HotelId", table: "Promocodes", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_PurchaseItems_Hotels_HotelId", table: "PurchaseItems", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_PurchaseReturns_Hotels_HotelId", table: "PurchaseReturns", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_RefundRecords_Hotels_HotelId", table: "RefundRecords", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Reservation_Hotels_HotelId", table: "Reservation", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_ReservationRooms_Hotels_HotelId", table: "ReservationRooms", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(name: "FK_RoomFacility_Hotels_HotelId", table: "RoomFacility", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_RoomTypeFacility_Hotels_HotelId", table: "RoomTypeFacility", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Tariff_Hotels_HotelId", table: "Tariff", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_Taxes_Hotels_HotelId", table: "Taxes", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_WakeUpCalls_Hotels_HotelId", table: "WakeUpCalls", column: "HotelId", principalTable: "Hotels", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Rooms_Hotels_HotelId", table: "Rooms");
            migrationBuilder.DropForeignKey(name: "FK_Bookings_Hotels_HotelId", table: "Bookings");
            migrationBuilder.DropForeignKey(name: "FK_Complementaries_Hotels_HotelId", table: "Complementaries");
            migrationBuilder.DropForeignKey(name: "FK_Currencies_Hotels_HotelId", table: "Currencies");
            migrationBuilder.DropForeignKey(name: "FK_FinancialYears_Hotels_HotelId", table: "FinancialYears");
            migrationBuilder.DropForeignKey(name: "FK_FloorPlans_Hotels_HotelId", table: "FloorPlans");
            migrationBuilder.DropForeignKey(name: "FK_Guests_Hotels_HotelId", table: "Guests");
            migrationBuilder.DropForeignKey(name: "FK_InventoryItems_Hotels_HotelId", table: "InventoryItems");
            migrationBuilder.DropForeignKey(name: "FK_Invoices_Hotels_HotelId", table: "Invoices");
            migrationBuilder.DropForeignKey(name: "FK_MenuItems_Hotels_HotelId", table: "MenuItems");
            migrationBuilder.DropForeignKey(name: "FK_OpeningBalances_Hotels_HotelId", table: "OpeningBalances");
            migrationBuilder.DropForeignKey(name: "FK_OrderItems_Hotels_HotelId", table: "OrderItems");
            migrationBuilder.DropForeignKey(name: "FK_Orders_Hotels_HotelId", table: "Orders");
            migrationBuilder.DropForeignKey(name: "FK_OtherPaymentInvoiceItems_Hotels_HotelId", table: "OtherPaymentInvoiceItems");
            migrationBuilder.DropForeignKey(name: "FK_OtherPaymentInvoices_Hotels_HotelId", table: "OtherPaymentInvoices");
            migrationBuilder.DropForeignKey(name: "FK_PaymentMethods_Hotels_HotelId", table: "PaymentMethods");
            migrationBuilder.DropForeignKey(name: "FK_Payments_Hotels_HotelId", table: "Payments");
            migrationBuilder.DropForeignKey(name: "FK_Promocodes_Hotels_HotelId", table: "Promocodes");
            migrationBuilder.DropForeignKey(name: "FK_PurchaseItems_Hotels_HotelId", table: "PurchaseItems");
            migrationBuilder.DropForeignKey(name: "FK_PurchaseReturns_Hotels_HotelId", table: "PurchaseReturns");
            migrationBuilder.DropForeignKey(name: "FK_RefundRecords_Hotels_HotelId", table: "RefundRecords");
            migrationBuilder.DropForeignKey(name: "FK_Reservation_Hotels_HotelId", table: "Reservation");
            migrationBuilder.DropForeignKey(name: "FK_ReservationRooms_Hotels_HotelId", table: "ReservationRooms");
            migrationBuilder.DropForeignKey(name: "FK_RoomFacility_Hotels_HotelId", table: "RoomFacility");
            migrationBuilder.DropForeignKey(name: "FK_RoomTypeFacility_Hotels_HotelId", table: "RoomTypeFacility");
            migrationBuilder.DropForeignKey(name: "FK_Tariff_Hotels_HotelId", table: "Tariff");
            migrationBuilder.DropForeignKey(name: "FK_Taxes_Hotels_HotelId", table: "Taxes");
            migrationBuilder.DropForeignKey(name: "FK_WakeUpCalls_Hotels_HotelId", table: "WakeUpCalls");

            migrationBuilder.DropIndex(name: "IX_Rooms_HotelId", table: "Rooms");
            migrationBuilder.DropIndex(name: "IX_WakeUpCalls_HotelId", table: "WakeUpCalls");
            migrationBuilder.DropIndex(name: "IX_Taxes_HotelId", table: "Taxes");
            migrationBuilder.DropIndex(name: "IX_Tariff_HotelId", table: "Tariff");
            migrationBuilder.DropIndex(name: "IX_RoomTypeFacility_HotelId", table: "RoomTypeFacility");
            migrationBuilder.DropIndex(name: "IX_RoomFacility_HotelId", table: "RoomFacility");
            migrationBuilder.DropIndex(name: "IX_ReservationRooms_HotelId", table: "ReservationRooms");
            migrationBuilder.DropIndex(name: "IX_Reservation_HotelId", table: "Reservation");
            migrationBuilder.DropIndex(name: "IX_RefundRecords_HotelId", table: "RefundRecords");
            migrationBuilder.DropIndex(name: "IX_PurchaseReturns_HotelId", table: "PurchaseReturns");
            migrationBuilder.DropIndex(name: "IX_PurchaseItems_HotelId", table: "PurchaseItems");
            migrationBuilder.DropIndex(name: "IX_Promocodes_HotelId", table: "Promocodes");
            migrationBuilder.DropIndex(name: "IX_Payments_HotelId", table: "Payments");
            migrationBuilder.DropIndex(name: "IX_PaymentMethods_HotelId", table: "PaymentMethods");
            migrationBuilder.DropIndex(name: "IX_OtherPaymentInvoices_HotelId", table: "OtherPaymentInvoices");
            migrationBuilder.DropIndex(name: "IX_OtherPaymentInvoiceItems_HotelId", table: "OtherPaymentInvoiceItems");
            migrationBuilder.DropIndex(name: "IX_Orders_HotelId", table: "Orders");
            migrationBuilder.DropIndex(name: "IX_OrderItems_HotelId", table: "OrderItems");
            migrationBuilder.DropIndex(name: "IX_OpeningBalances_HotelId", table: "OpeningBalances");
            migrationBuilder.DropIndex(name: "IX_MenuItems_HotelId", table: "MenuItems");
            migrationBuilder.DropIndex(name: "IX_Invoices_HotelId", table: "Invoices");
            migrationBuilder.DropIndex(name: "IX_InventoryItems_HotelId", table: "InventoryItems");
            migrationBuilder.DropIndex(name: "IX_Guests_HotelId", table: "Guests");
            migrationBuilder.DropIndex(name: "IX_FloorPlans_HotelId", table: "FloorPlans");
            migrationBuilder.DropIndex(name: "IX_FinancialYears_HotelId", table: "FinancialYears");
            migrationBuilder.DropIndex(name: "IX_Currencies_HotelId", table: "Currencies");
            migrationBuilder.DropIndex(name: "IX_Complementaries_HotelId", table: "Complementaries");
            migrationBuilder.DropIndex(name: "IX_Bookings_HotelId", table: "Bookings");

            migrationBuilder.DropColumn(name: "HotelId", table: "Rooms");
            migrationBuilder.DropColumn(name: "HotelId", table: "WakeUpCalls");
            migrationBuilder.DropColumn(name: "HotelId", table: "Taxes");
            migrationBuilder.DropColumn(name: "HotelId", table: "Tariff");
            migrationBuilder.DropColumn(name: "HotelId", table: "RoomTypeFacility");
            migrationBuilder.DropColumn(name: "HotelId", table: "RoomFacility");
            migrationBuilder.DropColumn(name: "HotelId", table: "ReservationRooms");
            migrationBuilder.DropColumn(name: "HotelId", table: "Reservation");
            migrationBuilder.DropColumn(name: "HotelId", table: "RefundRecords");
            migrationBuilder.DropColumn(name: "HotelId", table: "PurchaseReturns");
            migrationBuilder.DropColumn(name: "HotelId", table: "PurchaseItems");
            migrationBuilder.DropColumn(name: "HotelId", table: "Promocodes");
            migrationBuilder.DropColumn(name: "HotelId", table: "Payments");
            migrationBuilder.DropColumn(name: "HotelId", table: "PaymentMethods");
            migrationBuilder.DropColumn(name: "HotelId", table: "OtherPaymentInvoices");
            migrationBuilder.DropColumn(name: "HotelId", table: "OtherPaymentInvoiceItems");
            migrationBuilder.DropColumn(name: "HotelId", table: "Orders");
            migrationBuilder.DropColumn(name: "HotelId", table: "OrderItems");
            migrationBuilder.DropColumn(name: "HotelId", table: "OpeningBalances");
            migrationBuilder.DropColumn(name: "HotelId", table: "MenuItems");
            migrationBuilder.DropColumn(name: "HotelId", table: "Invoices");
            migrationBuilder.DropColumn(name: "HotelId", table: "InventoryItems");
            migrationBuilder.DropColumn(name: "HotelId", table: "Guests");
            migrationBuilder.DropColumn(name: "HotelId", table: "FloorPlans");
            migrationBuilder.DropColumn(name: "HotelId", table: "FinancialYears");
            migrationBuilder.DropColumn(name: "HotelId", table: "Currencies");
            migrationBuilder.DropColumn(name: "HotelId", table: "Complementaries");
            migrationBuilder.DropColumn(name: "HotelId", table: "CommissionAgents");
            migrationBuilder.DropColumn(name: "HotelId", table: "CancellationPolicies");
            migrationBuilder.DropColumn(name: "HotelId", table: "BookingTypes");
            migrationBuilder.DropColumn(name: "HotelId", table: "BookingSources");
            migrationBuilder.DropColumn(name: "HotelId", table: "Bookings");
            migrationBuilder.DropColumn(name: "HotelId", table: "BookingGuests");
            migrationBuilder.DropColumn(name: "HotelId", table: "BookingDocuments");
        }
    }
}