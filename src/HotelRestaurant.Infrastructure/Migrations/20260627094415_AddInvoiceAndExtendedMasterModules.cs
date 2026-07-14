using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HotelRestaurant.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInvoiceAndExtendedMasterModules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OtherPaymentInvoices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InvoiceNo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CustomerName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Mobile = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    CustomerAddress = table.Column<string>(type: "text", nullable: true),
                    Gstin = table.Column<string>(type: "text", nullable: true),
                    Remarks = table.Column<string>(type: "text", nullable: true),
                    AttachmentName = table.Column<string>(type: "text", nullable: true),
                    SubTotalSummary = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalGstSummary = table.Column<decimal>(type: "numeric", nullable: false),
                    Adjustment = table.Column<decimal>(type: "numeric", nullable: false),
                    RoundOff = table.Column<decimal>(type: "numeric", nullable: false),
                    InvoiceAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    PaidAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtherPaymentInvoices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OtherPaymentInvoiceItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OtherPaymentInvoiceId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    Hsn = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    Unit = table.Column<string>(type: "text", nullable: false),
                    Rate = table.Column<decimal>(type: "numeric", nullable: false),
                    Qty = table.Column<int>(type: "integer", nullable: false),
                    SubTotal = table.Column<decimal>(type: "numeric", nullable: false),
                    GstRate = table.Column<decimal>(type: "numeric", nullable: false),
                    GstType = table.Column<string>(type: "text", nullable: false),
                    GstAmount = table.Column<decimal>(type: "numeric", nullable: false),
                    Total = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtherPaymentInvoiceItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OtherPaymentInvoiceItems_OtherPaymentInvoices_OtherPaymentI~",
                        column: x => x.OtherPaymentInvoiceId,
                        principalTable: "OtherPaymentInvoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OtherPaymentInvoiceItems_OtherPaymentInvoiceId",
                table: "OtherPaymentInvoiceItems",
                column: "OtherPaymentInvoiceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OtherPaymentInvoiceItems");

            migrationBuilder.DropTable(
                name: "OtherPaymentInvoices");
        }
    }
}
