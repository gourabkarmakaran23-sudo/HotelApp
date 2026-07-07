import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

@Component({
  selector: 'app-report-engine',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './report-engine.component.html',
  styleUrls: ['./report-engine.component.scss']
})
export class ReportEngineComponent implements OnInit {
  reportTypeKey: string = 'booking';
  reportTitle: string = 'Booking Report';
  private gridApi!: GridApi;
  showVisibilityMenu: boolean = false;

  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressMovable: false
  };
  rowData: any[] = [];
  filteredRowData: any[] = [];

  // 📋 Booking Report Filters (10 Fields - Untouched)
  filterBookingStatus: string = '';
  filterPaymentStatus: string = '';
  filterCheckIn: string = '';
  filterCheckOut: string = '';
  filterCustomerName: string = '';
  filterCustomerPhone: string = '';
  filterGuestName: string = '';
  filterGuestPhone: string = '';
  filterRefBookingNo: string = '';
  filterBookingAmount: string = '';

  // 🍳 Meal Details Report Filters (3 Fields - Untouched)
  filterFromDate: string = '';
  filterToDate: string = '';
  filterMealType: string = '';

  // 📅 Monthly Summary Report Filters (2 Fields - Untouched)
  filterChooseMonth: string = '';
  filterChooseYear: string = '';

  // Native global objects mapping helper references for template scope view (Added to fix NG9)
  protected readonly Number = Number;
  // 🗓️ Month-Wise Revenue Sequential Table Collections (Added and Intact)
  monthWiseGroups: any[] = [];

  // 💳 Individual Transaction Report States (Added and Intact)
  filterTxnIndCustomer: string = '';
  filterTxnIndFromDate: string = '2025-10-30';
  filterTxnIndToDate: string = '2026-04-30';

  // ⏳ Total Payment Pending Report States (Added and Intact)
  filterPendingCheckinUpto: string = '2026-04-30 23:59:59';
  rowDataPaymentPending: any[] = [];


  customerOptionsList = [
    { id: '1', name: 'Mr. sp das' },
    { id: '2', name: 'Mr. s sengupta' },
    { id: '3', name: 'Mr. Ajimol Khan' }
  ];

  monthsList = [
    { name: 'January', value: 'January' }, { name: 'February', value: 'February' },
    { name: 'March', value: 'March' }, { name: 'April', value: 'April' },
    { name: 'May', value: 'May' }, { name: 'June', value: 'June' },
    { name: 'July', value: 'July' }, { name: 'August', value: 'August' },
    { name: 'September', value: 'September' }, { name: 'October', value: 'October' },
    { name: 'November', value: 'November' }, { name: 'December', value: 'December' }
  ];
  yearsList = ['2024', '2025', '2026', '2027'];

  // 💳 Monthly Payment Details Report Filters (5 Fields - Untouched)
  filterPayServiceFor: string = '';
  filterPayBookingStatus: string = '';
  filterPayMode: string = '';
  filterPayFromDate: string = '';
  filterPayToDate: string = '';

  // 📊 Payment Summary Report Filters (2 Fields - Untouched)
  filterSumFromDate: string = '';
  filterSumToDate: string = '';

  // 🏨 Daily Room Occupancy Report Filters (2 Fields - Untouched)
  filterOccFromDate: string = '';
  filterOccToDate: string = '';

  // 🔑 Available Room Report Filters (2 Fields - Untouched)
  filterAvailFromDate: string = '';
  filterAvailToDate: string = '';

  // 🧾 GST Invoice Report Filters (3 Fields - Untouched)
  filterGstMonth: string = '';
  filterGstYear: string = '';
  filterGstType: string = '';

  // 🚪 Room Checkout Report Filters (3 Fields - Untouched)
  filterChkFromDate: string = '';
  filterChkToDate: string = '';
  filterChkSearchText: string = '';

  // 🚓 Police Report Filters (2 Fields - Untouched)
  filterPolFromDate: string = '';
  filterPolToDate: string = '';

  // 💸 Transaction Report Filters (4 Fields - Added and Protected)
  filterTxnCustomer: string = '';
  filterTxnFromDate: string = '';
  filterTxnToDate: string = '';
  filterTxnSearchText: string = '';

  // 🎁 Complementary Monthly Report Filters (3 Fields - Added)
  filterCompMonth: string = '04'; // Default April as per image_ed0204.jpg
  filterCompYear: string = '2026';
  filterCompStatus: string = 'All';

  // 🍽️ RMS Settlement Report Filters (3 Fields - Added)
  filterRmsMonth: string = '';
  filterRmsYear: string = '';
  filterRmsStatus: string = '';

  // 🏨 Today's Occupancy Tables (3 Multi-grids layout asset - Added)
  rowDataDepartureToday: any[] = [];
  rowDataCheckedOutToday: any[] = [];
  rowDataInHouseGuests: any[] = []

  // ✈️ OTA Summary Report States (Added and Intact)
  filterOtaCheckInFrom: string = '';
  filterOtaCheckOutFrom: string = '';

  // 📈 Revenue Report Analytics Configurations (Added and Intact)
  filterYtmStartFrom: string = '04-2025'; 
  filterCurrentMonthSelector: string = '2026-04';

  ytmStartOptions = [
    { value: '04-2025', name: 'April 2025' },
    { value: '01-2026', name: 'January 2026' }
  ];

  // 💰 Total Part/Advance Payment Report States (Added and Intact)
  filterAdvancePaymentDate: string = '2026-04-27';
  totalAdvanceSummaryAmount: number = 38402.00;

  // 📉 Outstanding Room Revenue Ledger States (Added and Intact)
  filterOutstandingUptoDate: string = '2026-04-30';

// 💳 In-Store Wallet List Report States (Updated to load data by default)
  filterWalletUptoDate: string = '2026-04-30';
  isWalletSearched: boolean = true; // 👈 false accurate chilo, ebar default true kore dilam

  // 🍳 Meal Details Report (Alt) States (Added and Intact)
  filterMealFromDate: string = '2026-04-28';
  filterMealTypeDtsl: string = 'Room with Breakfast';

  // 💸 Payment Pending Detailed Report States (Added and Intact)
  filterPendingStatus: string = '';
  filterPendingFrom: string = '';
  filterPendingTo: string = '';
  filterPendingCustName: string = '';
  filterPendingCustPhone: string = '';
  filterPendingGuestName: string = '';
  filterPendingGuestPhone: string = '';
  filterPendingRefNo: string = '';
  filterPendingBookingAmt: string = '';
  filterPendingDueAmt: string = '';
  filterPendingIncludeOta: string = 'No';

  statusOptionsList = ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled'];
 
  // ❌ Cancelled Detailed Report States (Added and Intact)
  filterCancelledPaymentStatus: string = '';
  filterCancelledFrom: string = '';
  filterCancelledTo: string = '';
  filterCancelledCustName: string = '';
  filterCancelledCustPhone: string = '';
  filterCancelledGuestName: string = '';
  filterCancelledGuestPhone: string = '';
  filterCancelledRefNo: string = '';
  filterCancelledBookingAmt: string = '';
  filterCancelledDueAmt: string = '';
  filterCancelledIncludeOta: string = 'No';

  paymentStatusOptionsList = ['Paid', 'Unpaid', 'Partially Paid'];
  
  // 🛒 Purchase Management Report States (Added and Intact)
  filterPurchaseFrom: string = '2026-04-30';
  filterPurchaseTo: string = '2026-04-30';

  // 📦 Inventory Stock Report States (Added and Intact)
  filterStockFrom: string = '2026-04-30';
  filterStockTo: string = '2026-04-30';

  // 📅 Daily Booking Operational Report States (Added and Intact)
  filterDailyBookingStatus: string = '';
  filterDailyBookingFrom: string = '2026-04-30';
  filterDailyBookingTo: string = '2026-05-07';


  mealTypeOptionsList = [
    'Room with Breakfast',
    'CP (Continental Plan)',
    'MAP (Modified American Plan)',
    'AP (American Plan)'
  ];

  rowDataOtaSummary: any[] = [];
  rowDataOtaBooked: any[] = [];
  rowDataOtaCheckedIn: any[] = [];

  columnDefsOtaSummary: ColDef[] = [];
  columnDefsOtaDetails: ColDef[] = [];





  bookingStatusesList: string[] = ['All', 'Booked', 'Checked-In', 'Checked-Out', 'Cancelled'];


  // Unique customers for drop-down filter metrics
  transactionCustomersList: string[] = ['Rahul Sharma', 'Amit Patel', 'Vertex Corp', 'Vikram Malhotra'];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportTypeKey = params['reportType'] || 'booking';
      this.initializeReportType();
    });
  }

  initializeReportType(): void {
    this.resetFilters();

    if (this.reportTypeKey === 'booking') {
      this.reportTitle = 'Booking Report';
      this.setupBookingGridColumns();
      this.loadBookingMockRecords();
    } 
    else if (this.reportTypeKey === 'meal' || this.reportTypeKey === 'meal_alt') {
      this.reportTitle = 'Meal Details Report';
      this.setupMealGridColumns();
      this.loadMealMockRecords();
    } 
    else if (this.reportTypeKey === 'monthly_summary') {
      this.reportTitle = 'Monthly Summary Report';
      this.setupMonthlySummaryGridColumns();
      this.loadMonthlySummaryMockRecords();
    }
    else if (this.reportTypeKey === 'payment_det') {
      this.reportTitle = 'Payment Details Report';
      this.setupPaymentDetailsGridColumns();
      this.loadPaymentDetailsMockRecords();
    }
    else if (this.reportTypeKey === 'payment_sum') {
      this.reportTitle = 'Payment Summary Report';
      this.setupPaymentSummaryGridColumns();
      this.loadPaymentSummaryMockRecords();
    }
    else if (this.reportTypeKey === 'daily_occupancy') {
      this.reportTitle = 'Daily Room Occupancy Report';
      this.setupDailyOccupancyGridColumns();
      this.loadDailyOccupancyMockRecords();
    }
    else if (this.reportTypeKey === 'available_rooms') {
      this.reportTitle = 'Available Room Report';
      this.setDefaultAvailableMatrixDates();
      this.setupAvailableRoomsGridColumns();
      this.loadAvailableRoomsMockRecords();
    }
    else if (this.reportTypeKey === 'gst_invoice') {
      this.reportTitle = 'GST Invoice Report';
      this.setupGstInvoiceGridColumns();
      this.loadGstInvoiceMockRecords();
    }
    else if (this.reportTypeKey === 'checkout_rep') {
      this.reportTitle = 'Room Checkout Report';
      this.setupRoomCheckoutGridColumns();
      this.loadRoomCheckoutMockRecords();
    }
    else if (this.reportTypeKey === 'police_rep') {
      this.reportTitle = 'Police Report';
      this.setupPoliceGridColumns();
      this.loadPoliceMockRecords();
    }
    else if (this.reportTypeKey === 'transaction_rep') {
      this.reportTitle = 'Transaction Report';
      this.setupTransactionGridColumns();
      this.loadTransactionMockRecords();
    }
    else if (this.reportTypeKey === 'complementary') {
      this.reportTitle = 'Complementary Monthly Report';
      this.setupComplementaryGridColumns();
      this.loadComplementaryMockRecords();
    }
    else if (this.reportTypeKey === 'rms_settle') {
      this.reportTitle = 'RMS Settlement Report';
      this.setupRmsSettlementGridColumns();
      this.loadRmsSettlementMockRecords();
    }
    else if (this.reportTypeKey === 'today_occupancy') {
      this.reportTitle = "Today's Occupancy Report";
      this.setupTodayOccupancyGridColumns();
      this.loadTodayOccupancyMockRecords();
    }
    else if (this.reportTypeKey === 'ota_summary') {
      this.reportTitle = 'OTA Summary Report';
      this.setupOtaSummaryGridColumns();
      this.loadOtaSummaryMockRecords();
    }
    else if (this.reportTypeKey === 'revenue') {
      this.reportTitle = 'Revenue Matrix Analytics Report';
      this.setupRevenueMatrixGroupHeaders();
      this.loadRevenueMatrixMockRecords();
    }
    else if (this.reportTypeKey === 'month_revenue') {
      this.reportTitle = 'Month-Wise Revenue Matrix Report';
      this.loadMonthWiseRevenueDatasetGrid();
    }
    else if (this.reportTypeKey === 'indiv_trans') {
      this.reportTitle = 'Individual Transaction Ledger Report';
      this.setupIndividualTransactionColumns();
      this.loadIndividualTransactionMockRecords();
    }
    else if (this.reportTypeKey === 'pending_total') {
      this.reportTitle = 'Total Payment Pending Summary Report';
      this.setupPaymentPendingColumns();
      this.loadPaymentPendingMockRecords();
    }
    else if (this.reportTypeKey === 'part_payment') {
      this.reportTitle = 'Total Advance Payment Before Checkout';
      this.setupAdvancePaymentGridColumns();
      this.loadAdvancePaymentMockRecords();
    }

    else if (this.reportTypeKey === 'outstanding_rev') {
      this.reportTitle = 'Outstanding Room Revenue Report';
      this.setupOutstandingRevenueColumns();
      this.loadOutstandingRevenueMockRecords();
    }
   else if (this.reportTypeKey === 'wallet_list') {
      this.reportTitle = 'In-Store Wallet List Report';
      this.setupWalletListColumns();
      this.isWalletSearched = true; // Ensure state is active
      this.loadWalletListMockRecords(); // Initial row state force trigger
    }

    else if (this.reportTypeKey === 'meal_alt') {
      this.reportTitle = 'Meal Details Report';
      this.setupMealDetailsColumns();
      this.loadMealDetailsMockRecords();
    }

    else if (this.reportTypeKey === 'payment_pending') {
      this.reportTitle = 'Payment Pending Report';
      this.setupPaymentPendingDetailedColumns();
      this.loadPaymentPendingDetailedMockRecords();
    }

    else if (this.reportTypeKey === 'cancelled') {
      this.reportTitle = 'Cancelled Report';
      this.setupCancelledDetailedColumns();
      this.loadCancelledDetailedMockRecords();
    }

    else if (this.reportTypeKey === 'purchase_rep') {
      this.reportTitle = 'Purchase Report';
      this.setupPurchaseReportColumns();
      this.loadPurchaseReportMockRecords();
    }
    else if (this.reportTypeKey === 'stock_rep') {
      this.reportTitle = 'Stock Report';
      this.setupStockReportColumns();
      this.loadStockReportMockRecords();
    }

    else if (this.reportTypeKey === 'daily_booking') {
      this.reportTitle = 'Daily Booking Report';
      this.setupDailyBookingReportColumns();
      this.loadDailyBookingReportMockRecords();
    }

    this.refreshGridOptionsApi();
  }

  private refreshGridOptionsApi(): void {
    if (this.gridApi) {
      this.gridApi.setGridOption('columnDefs', this.columnDefs);
      this.gridApi.setGridOption('rowData', this.filteredRowData);
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.refreshGridOptionsApi();
  }

  setupBookingGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Action', field: 'action', width: 90, pinned: 'left', cellRenderer: () => `<button style="background: #3182ce; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight:600; cursor:pointer;">View</button>` },
      { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 65, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 140 },
      { headerName: 'Booking Date', field: 'bookingDate', width: 120 },
      { headerName: 'Room Type', field: 'roomType', width: 130 },
      { headerName: 'Room Number', field: 'roomNumber', width: 120 },
      { headerName: 'Check In', field: 'checkInDate', width: 110 },
      { headerName: 'Check Out', field: 'checkOutDate', width: 110 },
      { headerName: 'Pax', field: 'paxDetails', width: 80 },
      { headerName: 'Meal Plan', field: 'mealPlan', width: 130 },
      { headerName: 'Room Rate', field: 'roomRate', width: 110, valueFormatter: p => '₹' + p.value },
      { headerName: 'Meal Plan Amount', field: 'mealPlanAmount', width: 140, valueFormatter: p => '₹' + p.value },
      { headerName: 'Total Room Rent', field: 'totalRoomRent', width: 140, valueFormatter: p => '₹' + p.value },
      { headerName: 'GST', field: 'gstTax', width: 100, valueFormatter: p => '₹' + p.value },
      { headerName: 'Total Payment', field: 'totalPayment', width: 130, valueFormatter: p => '₹' + p.value }
    ];
  }

  setupMealGridColumns(): void {
    this.columnDefs = [
      { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 65, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 140 },
      { headerName: 'Booking Date', field: 'bookingDate', width: 120 },
      { headerName: 'Room Type', field: 'roomType', width: 130 },
      { headerName: 'Room Number', field: 'roomNumber', width: 120 },
      { headerName: 'Check In', field: 'checkInDate', width: 110 },
      { headerName: 'Check Out', field: 'checkOutDate', width: 110 },
      { headerName: 'Pax', field: 'paxDetails', width: 80 },
      { headerName: 'Meal Plan', field: 'mealPlan', width: 320 },
      { headerName: 'Meal Plan Amount', field: 'mealPlanAmount', width: 140, valueFormatter: p => '₹' + p.value },
      { headerName: 'Total Room Rent', field: 'totalRoomRent', width: 140, valueFormatter: p => '₹' + p.value },
      { headerName: 'GST', field: 'gstTax', width: 100, valueFormatter: p => '₹' + p.value },
      { headerName: 'Total Payment', field: 'totalPayment', width: 130, valueFormatter: p => '₹' + p.value }
    ];
  }

  setupMonthlySummaryGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 90, pinned: 'left' },
      { headerName: 'Year', field: 'summaryYear', width: 120 },
      { headerName: 'Month', field: 'summaryMonth', width: 150 },
      { headerName: 'Total Bookings', field: 'totalBookings', width: 160 },
      { headerName: 'Total Revenue', field: 'totalRevenue', width: 180, valueFormatter: p => '₹' + p.value },
      { headerName: 'Total Adjustment', field: 'totalAdjustment', width: 180, valueFormatter: p => '₹' + p.value },
      { headerName: 'Avg Revenue/Day', field: 'avgRevenuePerDay', width: 180, valueFormatter: p => '₹' + p.value }
    ];
  }

  setupPaymentDetailsGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 80, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 140 },
      { headerName: 'Receipt Number', field: 'receiptNumber', width: 140 },
      { headerName: 'Merchant Transaction No.', field: 'merchantTxnNo', width: 190 },
      { headerName: 'Payment Date', field: 'paymentDate', width: 120 },
      { headerName: 'Amount Paid', field: 'amountPaid', width: 130, valueFormatter: p => '₹' + p.value },
      { headerName: 'Room Bill', field: 'roomBill', width: 120, valueFormatter: p => '₹' + p.value },
      { headerName: 'Food Paid', field: 'foodPaid', width: 120, valueFormatter: p => '₹' + p.value },
      { headerName: 'Payment Mode', field: 'paymentMode', width: 130 },
      { headerName: 'Service For', field: 'serviceFor', width: 140 },
      { headerName: 'Customer Name', field: 'customerName', width: 160 },
      { headerName: 'Transaction Details', field: 'txnDetails', width: 220 },
      { headerName: 'Booking Status', field: 'bookingStatus', width: 130 },
      { headerName: 'Room Numbers', field: 'roomNumbers', width: 130 }
    ];
  }

  setupPaymentSummaryGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Payment Date', field: 'paymentDate', width: 130, pinned: 'left' },
      { headerName: 'Cash Payment Room', field: 'cashRoom', width: 160, valueFormatter: p => '₹' + p.value },
      { headerName: 'Cash Payment Food', field: 'cashFood', width: 160, valueFormatter: p => '₹' + p.value },
      { headerName: 'Bank Payment Room', field: 'bankRoom', width: 160, valueFormatter: p => '₹' + p.value },
      { headerName: 'Bank Payment Food', field: 'bankFood', width: 160, valueFormatter: p => '₹' + p.value },
      { headerName: 'UPI Room', field: 'upiRoom', width: 130, valueFormatter: p => '₹' + p.value },
      { headerName: 'UPI Food', field: 'upiFood', width: 130, valueFormatter: p => '₹' + p.value },
      { headerName: 'Debit Card Room', field: 'debitRoom', width: 150, valueFormatter: p => '₹' + p.value },
      { headerName: 'Debit Card Food', field: 'debitFood', width: 150, valueFormatter: p => '₹' + p.value },
      { headerName: 'Credit Card Room', field: 'creditRoom', width: 150, valueFormatter: p => '₹' + p.value },
      { headerName: 'Credit Card Food', field: 'creditFood', width: 150, valueFormatter: p => '₹' + p.value },
      { headerName: 'Corporate Credit Room', field: 'corporateRoom', width: 180, valueFormatter: p => '₹' + p.value },
      { headerName: 'Corporate Food', field: 'corporateFood', width: 150, valueFormatter: p => '₹' + p.value },
      { headerName: 'GM Credit Room', field: 'gmRoom', width: 140, valueFormatter: p => '₹' + p.value },
      { headerName: 'GM Credit Food', field: 'gmFood', width: 140, valueFormatter: p => '₹' + p.value },
      { headerName: 'Credit Note Room', field: 'noteRoom', width: 160, valueFormatter: p => '₹' + p.value },
      { headerName: 'Credit Note Food', field: 'noteFood', width: 160, valueFormatter: p => '₹' + p.value },
      { headerName: 'OTA Credit Room', field: 'otaRoom', width: 150, valueFormatter: p => '₹' + p.value },
      { headerName: 'OTA Credit Food', field: 'otaFood', width: 150, valueFormatter: p => '₹' + p.value }
    ];
  }

  setupDailyOccupancyGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 90, pinned: 'left' },
      { headerName: 'Date', field: 'occupancyDate', width: 140, pinned: 'left' },
      { headerName: 'Total Rooms', field: 'totalRooms', width: 140 },
      { headerName: 'Occupied Rooms', field: 'occupiedRooms', width: 160 },
      { headerName: 'Blocked Rooms', field: 'blockedRooms', width: 150 },
      { headerName: 'Available Rooms', field: 'availableRooms', width: 160 },
      { headerName: 'Occupancy Rate', field: 'occupancyRate', width: 160, valueFormatter: p => p.value + '%' }
    ];
  }

  private setDefaultAvailableMatrixDates(): void {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    this.filterAvailFromDate = today.toISOString().split('T')[0];
    this.filterAvailToDate = nextWeek.toISOString().split('T')[0];
  }

  setupAvailableRoomsGridColumns(): void {
    const baseColumns: ColDef[] = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Room Type', field: 'roomType', width: 220, pinned: 'left' }
    ];
    if (!this.filterAvailFromDate || !this.filterAvailToDate) {
      this.columnDefs = baseColumns;
      return;
    }
    const start = new Date(this.filterAvailFromDate);
    const end = new Date(this.filterAvailToDate);
    const dynamicDates: ColDef[] = [];
    const current = new Date(start);
    while (current <= end) {
      const dateString = current.toISOString().split('T')[0]; 
      const displayDay = String(current.getDate()).padStart(2, '0');
      const displayMonth = String(current.getMonth() + 1).padStart(2, '0');
      const displayYear = current.getFullYear();
      dynamicDates.push({
        headerName: `${displayDay}/${displayMonth}/${displayYear}`,
        field: `date_${dateString}`,
        width: 125,
        cellStyle: { textAlign: 'center' }
      });
      current.setDate(current.getDate() + 1);
    }
    this.columnDefs = [...baseColumns, ...dynamicDates];
  }

  setupGstInvoiceGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 155, pinned: 'left' },
      { headerName: 'Type', field: 'invoiceType', width: 110 },
      { headerName: 'Invoice No.', field: 'invoiceNo', width: 140 },
      { headerName: 'Invoice Date', field: 'invoiceDate', width: 125 },
      { headerName: 'HSN Code', field: 'hsnCode', width: 115 },
      { headerName: 'Customer Name', field: 'customerName', width: 170 },
      { headerName: 'GSTIN', field: 'gstIn', width: 155 },
      { headerName: '5% Sub Total', field: 'subTotal5', width: 130, valueFormatter: p => '₹' + p.value },
      { headerName: '18% Sub Total', field: 'subTotal18', width: 130, valueFormatter: p => '₹' + p.value },
      { headerName: 'Sub Total', field: 'subTotalAll', width: 130, valueFormatter: p => '₹' + p.value }
    ];
  }

  setupRoomCheckoutGridColumns(): void {
    this.columnDefs = [
      {
        headerName: 'Action',
        field: 'action',
        width: 100,
        pinned: 'left',
        cellRenderer: () => `<button style="background: #e53e3e; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight:600; cursor:pointer;">Checkout</button>`
      },
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 155 },
      { headerName: 'Customer Name', field: 'customerName', width: 170 },
      { headerName: 'Room No', field: 'roomNo', width: 110 },
      { headerName: 'Room Type', field: 'roomType', width: 145 },
      { headerName: 'No. of Pax', field: 'noOfPax', width: 110 },
      { headerName: 'Check In', field: 'checkInDate', width: 125 },
      { headerName: 'Check Out', field: 'checkOutDate', width: 125 },
      { headerName: 'Booking Status', field: 'bookingStatus', width: 140 },
      { headerName: 'Remarks', field: 'remarks', width: 180 }
    ];
  }

  setupPoliceGridColumns(): void {
    this.columnDefs = [
      {
        headerName: 'Action',
        field: 'action',
        width: 90,
        pinned: 'left',
        cellRenderer: () => `<button style="background: #10b981; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight:600; cursor:pointer;">Logs</button>`
      },
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Name of the Guest', field: 'guestName', width: 180 },
      { headerName: 'Age', field: 'guestAge', width: 80 },
      { headerName: 'Nationality', field: 'nationality', width: 120 },
      { headerName: 'No. of Guest', field: 'noOfGuests', width: 120 },
      { headerName: 'Address', field: 'address', width: 220 },
      { headerName: 'Contact', field: 'contactNo', width: 130 },
      { headerName: 'Arrived From', field: 'arrivedFrom', width: 140 },
      { headerName: 'Portable Destination', field: 'probableDestination', width: 180 },
      { headerName: 'Room No.', field: 'roomNo', width: 110 },
      { headerName: 'Checked-In', field: 'checkedInTime', width: 150 },
      { headerName: 'Checked-Out', field: 'checkedOutTime', width: 150 }
    ];
  }

  setupTransactionGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 155 },
      { headerName: 'Booking Date', field: 'bookingDate', width: 130 },
      { headerName: 'Total Amount', field: 'totalAmount', width: 140, valueFormatter: p => '₹' + p.value },
      { headerName: 'Paid Amounts', field: 'paidAmount', width: 140, valueFormatter: p => '₹' + p.value },
      { headerName: 'Primary Guest', field: 'primaryGuest', width: 170 },
      { headerName: 'Mobile', field: 'mobileNumber', width: 130 },
      { headerName: 'Booking Source', field: 'bookingSource', width: 150 },
      { headerName: 'Billing/Customer Name', field: 'customerName', width: 180 }
    ];
  }

  setupComplementaryGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Check-out Date', field: 'checkoutDate', width: 180 },
      { headerName: 'Complementary Charge', field: 'complementaryCharge', width: 220, valueFormatter: p => Number(p.value).toFixed(2) }
    ];
  }

  loadComplementaryMockRecords(): void {
    this.rowData = [
      { checkoutDate: '01-04-2026', complementaryCharge: 0.00 },
      { checkoutDate: '02-04-2026', complementaryCharge: 0.00 },
      { checkoutDate: '03-04-2026', complementaryCharge: 0.00 }
    ];
    this.filteredRowData = [...this.rowData];
  }
  setupRmsSettlementGridColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'RMS Order No.', field: 'rmsOrderNo', width: 140 },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 155 },
      { headerName: 'Room Number', field: 'roomNumber', width: 120 },
      { headerName: 'Order Date', field: 'orderDate', width: 125 },
      { headerName: 'Due Amount', field: 'dueAmount', width: 130, valueFormatter: p => '₹' + Number(p.value).toFixed(2) },
      { headerName: 'Is Paid', field: 'isPaid', width: 100 },
      { headerName: 'Payment DateTime', field: 'paymentDateTime', width: 165 },
      { headerName: 'GST Invoice No.', field: 'gstInvoiceNo', width: 150 },
      { headerName: 'Check In', field: 'checkInDate', width: 125 },
      { headerName: 'Customer Name', field: 'customerName', width: 170 },
      { headerName: 'Customer Phone', field: 'customerPhone', width: 140 }
    ];
  }

  loadRmsSettlementMockRecords(): void {
    this.rowData = [
      { rmsOrderNo: 'RMS-2026-9081', bookingNumber: 'BK-2026-0811', roomNumber: 'A-204', orderDate: '2026-07-04', dueAmount: 1450.00, isPaid: 'Yes', paymentDateTime: '2026-07-04 21:15', gstInvoiceNo: 'GST-RMS-4412', checkInDate: '2026-07-04', customerName: 'Rahul Sharma', customerPhone: '9876543210' }
    ];
    this.filteredRowData = [...this.rowData];
  }

  setupTodayOccupancyGridColumns(): void {
    // Shared common configuration across all three tables
    this.columnDefs = [
      { headerName: 'SL. No', valueGetter: 'node.rowIndex + 1', width: 75, pinned: 'left' },
      { headerName: 'Booking No.', field: 'bookingNo', width: 130 },
      { headerName: 'Guest Name', field: 'guestName', width: 160 },
      { headerName: 'Guest Ph. Number', field: 'guestPhone', width: 150 },
      { headerName: 'Room No', field: 'roomNo', width: 100 },
      { headerName: 'Meal Plan', field: 'mealPlan', width: 110 },
      { headerName: 'Pax', field: 'pax', width: 90 },
      { headerName: 'Check-In', field: 'checkIn', width: 130 },
      { headerName: 'Check-Out', field: 'checkOut', width: 130 },
      { headerName: 'Booking Source', field: 'bookingSource', width: 150 },
      { headerName: 'Company/Customer Name', field: 'companyCustomerName', width: 190 },
      { headerName: 'Contact Number', field: 'contactNo', width: 140 },
      { headerName: 'Remarks', field: 'remarks', width: 130 }
    ];
  }

  loadTodayOccupancyMockRecords(): void {
    // 1. Departure Today Mock Data (Matches image_ee5452.jpg)
    this.rowDataDepartureToday = [
      { bookingNo: '00000011', guestName: 's sengupta', guestPhone: '917000000001', roomNo: '203', mealPlan: 'EP', pax: '3 + 0', checkIn: '29-04-2026', checkOut: '30-04-2026', bookingSource: 'Kolkata Back Office', companyCustomerName: 'Mr. s sengupta', contactNo: '7000000001', remarks: '' }
    ];

    // 2. Checked-Out Mock Data (Empty states as shown in template)
    this.rowDataCheckedOutToday = [];

    // 3. IN-House Guest Mock Data
    this.rowDataInHouseGuests = [
      { bookingNo: '00000008', guestName: 'Ms. Ashrita', guestPhone: '917899999999', roomNo: '304', mealPlan: 'EP', pax: '2 + 0', checkIn: '28-04-2026', checkOut: '03-05-2026', bookingSource: 'Kolkata Back', companyCustomerName: 'Ms. Ashrita Dutta', contactNo: '7899999999', remarks: '' }
    ];
  }

  setupOtaSummaryGridColumns(): void {
    // 1. Column Definition for the main Summary Matrix
    this.columnDefsOtaSummary = [
      { headerName: 'Sl. No.', valueGetter: 'node.rowIndex + 1', width: 90, pinned: 'left' },
      { headerName: 'Confirmed', field: 'confirmed', width: 180 },
      { headerName: 'Checked In', field: 'checkedIn', width: 180 },
      { headerName: 'Checked Out', field: 'checkedOut', width: 180 },
      { headerName: 'Cancelled', field: 'cancelled', width: 180 }
    ];

    // 2. Column Definition shared across Booked & Checked In data grids
    this.columnDefsOtaDetails = [
      { headerName: 'Sl. No.', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 150 },
      { headerName: 'Booking Date', field: 'bookingDate', width: 130 },
      { headerName: 'Booking Ref No.', field: 'bookingRefNo', width: 160 },
      { headerName: 'Primary Guest', field: 'primaryGuest', width: 170 },
      { headerName: 'Customer Name', field: 'customerName', width: 170 },
      { headerName: 'Total Booking Price', field: 'totalPrice', width: 160, valueFormatter: p => '₹' + Number(p.value).toFixed(2) },
      { headerName: 'Remarks', field: 'remarks', width: 140 }
    ];

    // Fallback for parent toolbar dynamic checklist context reference 
    this.columnDefs = this.columnDefsOtaDetails;
  }

  setupRevenueMatrixGroupHeaders(): void {
    // strict ColDef interface map bypass korar jonno explicit 'any[]' dynamic data matrix layout schema bypass types apply kora holo
    this.columnDefs = [
      {
        headerName: 'Room Categorization Properties',
        pinned: 'left',
        children: [
          { headerName: 'Room Type', field: 'roomType', width: 140, cellStyle: { fontWeight: 'bold' } }
        ]
      },
      {
        headerName: 'Apr-2026 (Current Month Operations)',
        children: [
          { headerName: 'Room Nights', field: 'cmRoomNights', width: 110, type: 'numericColumn' },
          { headerName: 'Occup %', field: 'cmOccupancyPct', width: 100, valueFormatter: (p: any) => p.value ? p.value + '%' : '0%' },
          { headerName: 'Booked Revenue (Excl. GST)', field: 'cmRevenue', width: 195, valueFormatter: (p: any) => '₹' + Number(p.value).toFixed(2) },
          { headerName: 'ARR', field: 'cmArr', width: 100, valueFormatter: (p: any) => '₹' + Number(p.value).toFixed(2) }
        ]
      },
      {
        headerName: 'Year To Month Cumulative (YTM)',
        children: [
          { headerName: 'Room Nights', field: 'ytmRoomNights', width: 110, type: 'numericColumn' },
          { headerName: 'Occup %', field: 'ytmOccupancyPct', width: 100, valueFormatter: (p: any) => p.value ? p.value + '%' : '0%' },
          { headerName: 'Booked Revenue (Excl. GST)', field: 'ytmRevenue', width: 195, valueFormatter: (p: any) => '₹' + Number(p.value).toFixed(2) },
          { headerName: 'ARR', field: 'ytmArr', width: 100, valueFormatter: (p: any) => '₹' + Number(p.value).toFixed(2) }
        ]
      },
      {
        headerName: 'Apr-2025 (Year-over-Year Comparative Matrix)',
        children: [
          { headerName: 'Room Nights', field: 'yoyRoomNights', width: 110, type: 'numericColumn' },
          { headerName: 'Occup %', field: 'yoyOccupancyPct', width: 100, valueFormatter: (p: any) => p.value ? p.value + '%' : '0%' },
          { headerName: 'Booked Revenue (Excl. GST)', field: 'yoyRevenue', width: 195, valueFormatter: (p: any) => '₹' + Number(p.value).toFixed(2) },
          { headerName: 'ARR', field: 'yoyArr', width: 100, valueFormatter: (p: any) => '₹' + Number(p.value).toFixed(2) }
        ]
      }
    ] as any[]; // casting explicit matrix configuration map array directly to avoid interface compilation blocks
  }

  loadRevenueMatrixMockRecords(): void {
    this.rowData = [
      { roomType: 'Deluxe Suite (A)', cmRoomNights: 45, cmOccupancyPct: 75, cmRevenue: 135000.00, cmArr: 3000.00, ytmRoomNights: 540, ytmOccupancyPct: 68, ytmRevenue: 1620000.00, ytmArr: 3000.00, yoyRoomNights: 40, yoyOccupancyPct: 66, yoyRevenue: 112000.00, yoyArr: 2800.00 },
      { roomType: 'Executive Room (B)', cmRoomNights: 60, cmOccupancyPct: 85, cmRevenue: 150000.00, cmArr: 2500.00, ytmRoomNights: 710, ytmOccupancyPct: 79, ytmRevenue: 1775000.00, ytmArr: 2500.00, yoyRoomNights: 55, yoyOccupancyPct: 78, yoyRevenue: 1265000.00, yoyArr: 2300.00 },
      { roomType: 'GRAND TOTALS', cmRoomNights: 105, cmOccupancyPct: 80, cmRevenue: 285000.00, cmArr: 2714.28, ytmRoomNights: 1250, ytmOccupancyPct: 74, ytmRevenue: 3395000.00, ytmArr: 2716.00, yoyRoomNights: 95, yoyOccupancyPct: 73, yoyRevenue: 1377000.00, yoyArr: 2510.50 }
    ];
    this.filteredRowData = [...this.rowData];
  }

  setupIndividualTransactionColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 80, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 140, filter: 'agTextColumnFilter' },
      { headerName: 'Paid Amount', field: 'paidAmountDateTime', width: 160 }, // Displays Timestamp as shown in template image
      { headerName: 'Payment Amount', field: 'paymentAmount', width: 140, type: 'numericColumn', valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Primary Guest', field: 'primaryGuest', width: 160, filter: 'agTextColumnFilter' },
      { headerName: 'Mobile', field: 'mobile', width: 130 },
      { headerName: 'Booking Source', field: 'bookingSource', width: 140 },
      { headerName: 'Billing/Customer Name', field: 'billingName', width: 180 },
      { headerName: 'Merchant Transaction ID', field: 'merchantTxnId', width: 180 },
      { headerName: 'Transaction Details', field: 'txnDetails', width: 180 }
    ];
  }

  loadIndividualTransactionMockRecords(): void {
    this.rowData = [
      { bookingNumber: '00000012', paidAmountDateTime: '29-04-2026 18:17', paymentAmount: 2000.00, primaryGuest: 'Mr. sp das', mobile: '91-6000000001', bookingSource: 'Back Office', billingName: 'Mr. sp das', merchantTxnId: 'K26MR00000014', txnDetails: 'Advance Card/Acc Bank' },
      { bookingNumber: '00000011', paidAmountDateTime: '29-04-2026 15:17', paymentAmount: 4000.00, primaryGuest: 'Mr. s sengupta', mobile: '91-7000000001', bookingSource: 'Back Office', billingName: 'Mr. s sengupta', merchantTxnId: 'K26MR00000013', txnDetails: 'Bank Transfer' },
      { bookingNumber: '00000009', paidAmountDateTime: '28-04-2026 16:44', paymentAmount: 10001.00, primaryGuest: 'Mr. Ajimol Khan', mobile: '91-8000000001', bookingSource: 'Back Office', billingName: 'Mr. Ajimol Khan', merchantTxnId: 'K26MR00000011', txnDetails: 'adv.' },
      { bookingNumber: '00000009', paidAmountDateTime: '28-04-2026 16:44', paymentAmount: 1.00, primaryGuest: 'Mr. Ajimol Khan', mobile: '91-8000000001', bookingSource: 'Back Office', billingName: 'Mr. Ajimol Khan', merchantTxnId: 'K26MR00000012', txnDetails: '' },
      { bookingNumber: '00000008', paidAmountDateTime: '28-04-2026 11:29', paymentAmount: -1000.00, primaryGuest: 'Ms. Ashrita Dutta', mobile: '91-7899999999', bookingSource: 'Back Office', billingName: 'Ms. Ashrita Dutta', merchantTxnId: 'K26MR00000010', txnDetails: 'Refund' }
    ];
    this.filteredRowData = [...this.rowData];
  }

  setupPaymentPendingColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 90, pinned: 'left' },
      { headerName: 'Total Booking', field: 'totalBooking', width: 220, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Total Paid', field: 'totalPaid', width: 220, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Pending', field: 'pendingAmount', width: 220, cellStyle: { fontWeight: 'bold', color: '#dc2626' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' }
    ];
  }

  loadPaymentPendingMockRecords(): void {
    this.rowDataPaymentPending = [
      { totalBooking: 82400.00, totalPaid: 15002.00, pendingAmount: 67398.00 }
    ];
    this.filteredRowData = [...this.rowDataPaymentPending];
  }

  setupAdvancePaymentGridColumns(): void {
    this.columnDefs = [
      { headerName: 'SL NO.', valueGetter: 'node.rowIndex + 1', width: 95, pinned: 'left' },
      { headerName: 'BOOKING NUMBER', field: 'bookingNumber', width: 160, filter: 'agTextColumnFilter' },
      { headerName: 'CHECKIN DATE', field: 'checkinDate', width: 180 },
      { headerName: 'CHECKOUT DATE', field: 'checkoutDate', width: 180 },
      { headerName: 'CUSTOMER NAME', field: 'customerName', width: 220, filter: 'agTextColumnFilter' },
      { headerName: 'PAID AMOUNT', field: 'paidAmount', width: 160, type: 'numericColumn', cellStyle: { fontWeight: '600' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' }
    ];
  }

  loadAdvancePaymentMockRecords(): void {
    this.rowData = [
      { bookingNumber: '00000005', checkinDate: '2026-04-28 10:42:25', checkoutDate: '2026-04-28 10:50:15', customerName: 'Ms. Shreya Dutta', paidAmount: 22400.00 },
      { bookingNumber: '00000006', checkinDate: '2026-04-28 11:21:16', checkoutDate: '2026-04-29 16:43:10', customerName: 'Mr. Srimanta Chakraborty', paidAmount: 1000.00 },
      { bookingNumber: '00000009', checkinDate: '2026-04-28 12:00:00', checkoutDate: '2026-04-29 10:00:00', customerName: 'Mr. Ajimol Khan', paidAmount: 10002.00 },
      { bookingNumber: '00000011', checkinDate: '2026-04-29 16:49:13', checkoutDate: '2026-04-30 10:00:00', customerName: 'Mr. s sengupta', paidAmount: 4000.00 },
      { bookingNumber: '00000012', checkinDate: '2026-04-29 12:00:00', checkoutDate: '2026-04-30 10:00:00', customerName: 'Mr. sp das', paidAmount: 2000.00 }
    ];
    this.filteredRowData = [...this.rowData];
  }
  setupOutstandingRevenueColumns(): void {
    this.columnDefs = [
      { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 80, pinned: 'left' },
      { headerName: 'CheckOut Date', field: 'checkoutDate', width: 150 },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 160, filter: 'agTextColumnFilter' },
      { headerName: 'Booking Value', field: 'bookingValue', width: 160, type: 'numericColumn', valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Advance Amount', field: 'advanceAmount', width: 160, type: 'numericColumn', valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Due Amount', field: 'dueAmount', width: 160, type: 'numericColumn', cellStyle: { fontWeight: 'bold', color: '#b91c1c' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' }
    ];
  }

  loadOutstandingRevenueMockRecords(): void {
    this.rowData = [
      { checkoutDate: '30-04-2026', bookingNumber: '00000004', bookingValue: 11800.00, advanceAmount: 0.00, dueAmount: 11800.00 },
      { checkoutDate: '30-04-2026', bookingNumber: '00000012', bookingValue: 6800.00, advanceAmount: 2000.00, dueAmount: 4800.00 },
      { checkoutDate: '30-04-2026', bookingNumber: '00000011', bookingValue: 5000.00, advanceAmount: 4000.00, dueAmount: 1000.00 },
      { checkoutDate: 'Total', bookingNumber: '', bookingValue: 23600.00, advanceAmount: 6000.00, dueAmount: 17600.00 } // Total metrics row configuration
    ];
    this.filteredRowData = [...this.rowData];
  }

  setupWalletListColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 90, pinned: 'left' },
      { headerName: 'Customer Name', field: 'customerName', width: 220, filter: 'agTextColumnFilter' },
      { headerName: 'Mobile', field: 'mobile', width: 150 },
      { headerName: 'Total Topup Amount', field: 'totalTopup', width: 180, type: 'numericColumn', valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Used Balance', field: 'usedBalance', width: 160, type: 'numericColumn', valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Wallet Balance', field: 'walletBalance', width: 180, type: 'numericColumn', cellStyle: { fontWeight: 'bold', color: '#16a34a' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' }
    ];
  }

  loadWalletListMockRecords(): void {
    // Initializing dynamic rows to match exact ledger criteria when searched
    this.rowData = [
      { customerName: 'Mr. sp das', mobile: '91-6000000001', totalTopup: 5000.00, usedBalance: 1200.00, walletBalance: 3800.00 },
      { customerName: 'Mr. s sengupta', mobile: '91-7000000001', totalTopup: 10000.00, usedBalance: 4500.00, walletBalance: 5500.00 },
      { customerName: 'Mr. Ajimol Khan', mobile: '91-8000000001', totalTopup: 2500.00, usedBalance: 2500.00, walletBalance: 0.00 }
    ];
    
    // Explicitly initializing filteredRowData as empty matrix arrays to match screen state "No Result Found" before click execution operations
    this.filteredRowData = this.isWalletSearched ? [...this.rowData] : [];
  }

  setupMealDetailsColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 80, pinned: 'left' },
      { headerName: 'Room No.', field: 'roomNo', width: 110, sortable: true, filter: 'agTextColumnFilter' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 150, filter: 'agTextColumnFilter' },
      { headerName: 'Expected Meal', field: 'expectedMeal', width: 130, type: 'numericColumn' },
      { headerName: 'Actual Meal', field: 'actualMeal', width: 120 },
      { headerName: 'No. Pax', field: 'noPax', width: 100, type: 'numericColumn' },
      { headerName: 'Adults', field: 'adults', width: 100, type: 'numericColumn' },
      { headerName: 'Children', field: 'children', width: 100, type: 'numericColumn' },
      { headerName: 'Child Age', field: 'childAge', width: 110 },
      { headerName: 'Paid :: Non Paid', field: 'paidNonPaidStatus', width: 150, cellStyle: { fontWeight: '600', color: '#1e3a8a' } }
    ];
  }

  loadMealDetailsMockRecords(): void {
    this.rowData = [
      { roomNo: '102', bookingNumber: '00000002', expectedMeal: 3, actualMeal: '', noPax: 3, adults: 3, children: 0, childAge: '', paidNonPaidStatus: '3 :: 0' },
      { roomNo: '103', bookingNumber: '00000004', expectedMeal: 3, actualMeal: '', noPax: 3, adults: 2, children: 1, childAge: '8', paidNonPaidStatus: '3 :: 0' },
      { roomNo: '105', bookingNumber: '00000002', expectedMeal: 2, actualMeal: '', noPax: 2, adults: 2, children: 0, childAge: '', paidNonPaidStatus: '2 :: 0' }
    ];
    this.filteredRowData = [...this.rowData];
  }

  setupPaymentPendingDetailedColumns(): void {
    this.columnDefs = [
      { 
        headerName: 'Action', 
        field: 'action', 
        width: 90, 
        pinned: 'left',
        cellRenderer: () => `<button style="background:none; border:none; color:#64748b; cursor:pointer; font-weight:bold; font-size:16px;">⋮</button>`
      },
      { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 70, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 150, filter: 'agTextColumnFilter' },
      { headerName: 'Booking Date', field: 'bookingDate', width: 170 },
      { headerName: 'Room Type', field: 'roomType', width: 130 },
      { headerName: 'Room Number', field: 'roomNumber', width: 130 },
      { headerName: 'Check In', field: 'checkIn', width: 160 },
      { headerName: 'Check Out', field: 'checkOut', width: 160 },
      { headerName: 'Pax', field: 'pax', width: 80, type: 'numericColumn' },
      { headerName: 'Meal Plan', field: 'mealPlan', width: 110 },
      { headerName: 'Room Rate', field: 'roomRate', width: 130, type: 'numericColumn' },
      { headerName: 'Meal Plan Amount', field: 'mealPlanAmount', width: 150, type: 'numericColumn', valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Total Room Amount', field: 'totalRoomAmount', width: 160, type: 'numericColumn', cellStyle: { fontWeight: '600' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' }
    ];
  }

  loadPaymentPendingDetailedMockRecords(): void {
    this.rowData = [
      { bookingNumber: '00000004', bookingDate: '27-04-2026 18:38', roomType: 'ECVR', roomNumber: '103', checkIn: '28-04-2026 12:00', checkOut: '30-04-2026 10:00', pax: 3, mealPlan: 'CP', roomRate: '5900', mealPlanAmount: 1800.00, totalRoomAmount: 5900.00 },
      { bookingNumber: '00000002', bookingDate: '27-04-2026 18:22', roomType: 'ECVR, ER', roomNumber: '102, 105', checkIn: '27-04-2026 12:00', checkOut: '29-04-2026 10:00', pax: 5, mealPlan: 'CP, CP', roomRate: '6900, 4600', mealPlanAmount: 3000.00, totalRoomAmount: 11500.00 }
    ];
    this.filteredRowData = [...this.rowData];
  }

setupCancelledDetailedColumns(): void {
    this.columnDefs = [
      { 
        headerName: 'Action', 
        field: 'action', 
        width: 90, 
        pinned: 'left',
        cellRenderer: () => `<button style="background:none; border:none; color:#64748b; cursor:pointer; font-weight:bold; font-size:16px;">⋮</button>`
      },
      { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 70, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 140, filter: 'agTextColumnFilter' },
      { headerName: 'Cancel Date', field: 'cancelDate', width: 160 },
      { headerName: 'Booking Date', field: 'bookingDate', width: 160 },
      { headerName: 'Room Type', field: 'roomType', width: 120 },
      { headerName: 'Room Number', field: 'roomNumber', width: 130 },
      { headerName: 'Check In', field: 'checkIn', width: 160 },
      { headerName: 'Check Out', field: 'checkOut', width: 160 },
      { headerName: 'Pax', field: 'pax', width: 80, type: 'numericColumn' },
      { headerName: 'Meal Plan', field: 'mealPlan', width: 110 },
      { headerName: 'Room Rate', field: 'roomRate', width: 120, type: 'numericColumn' },
      { headerName: 'Meal Plan Amount', field: 'mealPlanAmount', width: 150, type: 'numericColumn', valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Total Room Amount', field: 'totalRoomAmount', width: 160, type: 'numericColumn', cellStyle: { fontWeight: '600', color: '#b91c1c' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' }
    ];
  }

  loadCancelledDetailedMockRecords(): void {
    this.rowData = [
      { bookingNumber: '00000007', cancelDate: '28-04-2026 00:00', bookingDate: '28-04-2026 11:25', roomType: 'ECVR', roomNumber: '302', checkIn: '28-04-2026 12:00', checkOut: '29-04-2026 10:00', pax: 2, mealPlan: 'CP', roomRate: '5000', mealPlanAmount: 600.00, totalRoomAmount: 5000.00 },
      { bookingNumber: '00000010', cancelDate: '28-04-2026 00:00', bookingDate: '28-04-2026 17:45', roomType: 'ER', roomNumber: '106', checkIn: '28-04-2026 12:00', checkOut: '29-04-2026 10:00', pax: 2, mealPlan: 'EP', roomRate: '4000', mealPlanAmount: 0.00, totalRoomAmount: 4000.00 }
    ];
    this.filteredRowData = [...this.rowData];
  }

  setupPurchaseReportColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 85, pinned: 'left' },
      { headerName: 'Date', field: 'purchaseDate', width: 140, sortable: true },
      { headerName: 'Invoice No.', field: 'invoiceNo', width: 160, filter: 'agTextColumnFilter' },
      { headerName: 'Supplier Name', field: 'supplierName', width: 240, filter: 'agTextColumnFilter' },
      { headerName: 'Total Amount', field: 'totalAmount', width: 160, type: 'numericColumn', cellStyle: { fontWeight: '600' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '₹0.00' },
      { 
        headerName: 'Action', 
        field: 'action', 
        width: 120,
        cellRenderer: () => `<button style="background:#3b82f6; color:white; border:none; padding:3px 12px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:600;">View</button>`
      }
    ];
  }

  loadPurchaseReportMockRecords(): void {
    this.rowData = [
      { purchaseDate: '2026-04-30', invoiceNo: 'PUR-2026-0089', supplierName: 'Rajlaxmi Food & Beverages Corp.', totalAmount: 14250.00 },
      { purchaseDate: '2026-04-30', invoiceNo: 'PUR-2026-0092', supplierName: 'Sharda Linen & Co.', totalAmount: 38900.00 },
      { purchaseDate: '2026-04-30', invoiceNo: 'PUR-2026-0095', supplierName: 'Balaji Dairy Traders', totalAmount: 6400.00 }
    ];
    this.filteredRowData = [...this.rowData];
  }

  setupStockReportColumns(): void {
    this.columnDefs = [
      { headerName: 'Sl. No', valueGetter: 'node.rowIndex + 1', width: 90, pinned: 'left' },
      { headerName: 'Product Name', field: 'productName', width: 260, sortable: true, filter: 'agTextColumnFilter' },
      { headerName: 'Quantity', field: 'quantity', width: 140, type: 'numericColumn' },
      { headerName: 'Price', field: 'price', width: 150, type: 'numericColumn', valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' },
      { headerName: 'Total', field: 'totalValue', width: 180, type: 'numericColumn', cellStyle: { fontWeight: '600' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '0.00' }
    ];
  }

  loadStockReportMockRecords(): void {
    this.rowData = [
      { productName: 'Basmati Rice Premium (A Grade)', quantity: 250, price: 95.00, totalValue: 23750.00 },
      { productName: 'Fresh Milk 500ml Packets', quantity: 120, price: 28.00, totalValue: 3360.00 },
      { productName: 'Refined Sunflower Oil 1L', quantity: 85, price: 145.00, totalValue: 12325.00 },
      { productName: 'Premium Bed Linens (Double King)', quantity: 40, price: 850.00, totalValue: 34000.00 }
    ];
    this.filteredRowData = [...this.rowData];
  }

  setupDailyBookingReportColumns(): void {
    this.columnDefs = [
      { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 70, pinned: 'left' },
      { headerName: 'Booking Number', field: 'bookingNumber', width: 140, filter: 'agTextColumnFilter' },
      { headerName: 'Booking Date', field: 'bookingDate', width: 150, sortable: true },
      { headerName: 'Guest Name', field: 'guestName', width: 180, filter: 'agTextColumnFilter' },
      { headerName: 'Room Type', field: 'roomType', width: 130 },
      { headerName: 'Room Number', field: 'roomNumber', width: 120 },
      { headerName: 'Check In', field: 'checkIn', width: 150 },
      { headerName: 'Check Out', field: 'checkOut', width: 150 },
      { headerName: 'Meal Plan', field: 'mealPlan', width: 110 },
      { headerName: 'Booking Status', field: 'bookingStatus', width: 140, 
        cellStyle: params => params.value === 'Confirmed' ? { color: '#16a34a', fontWeight: 'bold' } : { color: '#2563eb', fontWeight: 'bold' }
      },
      { headerName: 'Booking Amount', field: 'bookingAmount', width: 150, type: 'numericColumn', cellStyle: { fontWeight: '600' }, valueFormatter: p => p.value ? '₹' + Number(p.value).toFixed(2) : '₹0.00' }
    ];
  }

  loadDailyBookingReportMockRecords(): void {
    this.rowData = [
      { bookingNumber: 'BK-2026-1054', bookingDate: '2026-04-30', guestName: 'Anirban Das', roomType: 'Executive Suite', roomNumber: 'B-301', checkIn: '2026-05-01', checkOut: '2026-05-04', mealPlan: 'Room with Breakfast', bookingStatus: 'Confirmed', bookingAmount: 12000.00 },
      { bookingNumber: 'BK-2026-1059', bookingDate: '2026-05-02', guestName: 'Priya Mukherjee', roomType: 'Deluxe Room', roomNumber: 'A-104', checkIn: '2026-05-02', checkOut: '2026-05-05', mealPlan: 'CP', bookingStatus: 'Checked In', bookingAmount: 8500.00 },
      { bookingNumber: 'BK-2026-1062', bookingDate: '2026-05-04', guestName: 'Rajesh Sharma', roomType: 'Standard Room', roomNumber: 'C-202', checkIn: '2026-05-05', checkOut: '2026-05-07', mealPlan: 'EP', bookingStatus: 'Confirmed', bookingAmount: 5400.00 }
    ];
    this.filteredRowData = [...this.rowData];
  }

  loadMonthWiseRevenueDatasetGrid(): void {
    // 3-te dynamic months parallel matrix pattern array generate kora holo visually dynamic coloring handle korar jonno
    this.monthWiseGroups = [
      {
        rowId: 1,
        months: [
          { name: 'Sep-2025', colorTheme: 'light-blue', rows: [{ type: 'ECVR', nights: '0 / 180', occ: '0.00%', rev: 0, arr: '-' }, { type: 'ER', nights: '0 / 450', occ: '0.00%', rev: 0, arr: '-' }, { type: 'Total', nights: '0 / 630', occ: '0.00%', rev: 0, arr: '-' }] },
          { name: 'Oct-2025', colorTheme: 'light-orange', rows: [{ type: 'ECVR', nights: '0 / 186', occ: '0.00%', rev: 0, arr: '-' }, { type: 'ER', nights: '0 / 465', occ: '0.00%', rev: 0, arr: '-' }, { type: 'Total', nights: '0 / 651', occ: '0.00%', rev: 0, arr: '-' }] },
          { name: 'Nov-2025', colorTheme: 'light-blue', rows: [{ type: 'ECVR', nights: '0 / 180', occ: '0.00%', rev: 0, arr: '-' }, { type: 'ER', nights: '0 / 450', occ: '0.00%', rev: 0, arr: '-' }, { type: 'Total', nights: '0 / 630', occ: '0.00%', rev: 0, arr: '-' }] }
        ]
      },
      {
        rowId: 2,
        months: [
          { name: 'Dec-2025', colorTheme: 'light-blue', rows: [{ type: 'ECVR', nights: '0 / 186', occ: '0.00%', rev: 0, arr: '-' }, { type: 'ER', nights: '0 / 465', occ: '0.00%', rev: 0, arr: '-' }, { type: 'Total', nights: '0 / 651', occ: '0.00%', rev: 0, arr: '-' }] },
          { name: 'Jan-2026', colorTheme: 'light-orange', rows: [{ type: 'ECVR', nights: '0 / 186', occ: '0.00%', rev: 0, arr: '-' }, { type: 'ER', nights: '0 / 465', occ: '0.00%', rev: 0, arr: '-' }, { type: 'Total', nights: '0 / 651', occ: '0.00%', rev: 0, arr: '-' }] },
          { name: 'Feb-2026', colorTheme: 'light-blue', rows: [{ type: 'ECVR', nights: '0 / 168', occ: '0.00%', rev: 0, arr: '-' }, { type: 'ER', nights: '0 / 420', occ: '0.00%', rev: 0, arr: '-' }, { type: 'Total', nights: '0 / 588', occ: '0.00%', rev: 0, arr: '-' }] }
        ]
      }
    ];
  }


  loadOtaSummaryMockRecords(): void {
    // Top Matrix Summary Count
    this.rowDataOtaSummary = [
      { confirmed: 12, checkedIn: 5, checkedOut: 6, cancelled: 1 }
    ];

    // Booked Table Mock Dataset
    this.rowDataOtaBooked = [
      { bookingNumber: 'BK-OTA-7701', bookingDate: '2026-07-01', bookingRefNo: 'MMT9908112', primaryGuest: 'Amit Verma', customerName: 'MakeMyTrip Corp', totalPrice: 4500.00, remarks: 'Confirmed via API' }
    ];

    // Checked In Table Mock Dataset
    this.rowDataOtaCheckedIn = [
      { bookingNumber: 'BK-OTA-7649', bookingDate: '2026-06-30', bookingRefNo: 'AGO-451120', primaryGuest: 'Siddharth Roy', customerName: 'Agoda International', totalPrice: 3200.00, remarks: 'Early Check-In' }
    ];
  }

  loadBookingMockRecords(): void {
    this.rowData = [{ bookingNumber: 'BK-2026-0811', bookingDate: '2026-07-01', roomType: 'Deluxe Suite', roomNumber: 'A-204', checkInDate: '2026-07-04', checkOutDate: '2026-07-07', paxDetails: '2A + 1C', mealPlan: 'Room with Breakfast', roomRate: 4500, mealPlanAmount: 600, totalRoomRent: 13500, gstTax: 2430, totalPayment: 16530, customerName: 'Rahul Sharma', bookingStatus: 'Confirmed', paymentStatus: 'Paid' }];
    this.filteredRowData = [...this.rowData];
  }
  loadMealMockRecords(): void {
    this.rowData = [{ bookingNumber: 'BK-2026-0912', bookingDate: '2026-07-02', roomType: 'Executive Suite', roomNumber: 'B-301', checkInDate: '2026-07-05', checkOutDate: '2026-07-08', paxDetails: '2 Adults', mealPlan: 'Room with Breakfast', mealPlanAmount: 500, totalRoomRent: 12000, gstTax: 2160, totalPayment: 14660 }];
    this.filteredRowData = [...this.rowData];
  }
  loadMonthlySummaryMockRecords(): void {
    this.rowData = [{ summaryYear: '2026', summaryMonth: 'January', totalBookings: 142, totalRevenue: 639000, totalAdjustment: 12000, avgRevenuePerDay: 20612 }];
    this.filteredRowData = [...this.rowData];
  }
  loadPaymentDetailsMockRecords(): void {
    this.rowData = [{ bookingNumber: 'BK-2026-4410', receiptNumber: 'REC-99812', merchantTxnNo: 'TXN776100234', paymentDate: '2026-07-01', amountPaid: 15400, roomBill: 12000, foodPaid: 3400, paymentMode: 'UPI', serviceFor: 'Room Booking', customerName: 'Amit Patel', txnDetails: 'Paid successfully', bookingStatus: 'CheckedIn', roomNumbers: '102' }];
    this.filteredRowData = [...this.rowData];
  }
  loadPaymentSummaryMockRecords(): void {
    this.rowData = [{ paymentDate: '2026-07-01', cashRoom: 45000, cashFood: 12500, bankRoom: 35000, bankFood: 8000, upiRoom: 89000, upiFood: 22400, debitRoom: 15000, debitFood: 3000, creditRoom: 120000, creditFood: 41000 }];
    this.filteredRowData = [...this.rowData];
  }
  loadDailyOccupancyMockRecords(): void {
    this.rowData = [{ occupancyDate: '2026-07-01', totalRooms: 50, occupiedRooms: 38, blockedRooms: 2, availableRooms: 10, occupancyRate: 76.0 }];
    this.filteredRowData = [...this.rowData];
  }
  loadAvailableRoomsMockRecords(): void {
    this.rowData = [{ roomType: 'Deluxe Suite', 'date_2026-04-30': 8, 'date_2026-05-01': 5, 'date_2026-05-02': 6 }];
    this.filteredRowData = [...this.rowData];
  }
  loadGstInvoiceMockRecords(): void {
    this.rowData = [{ bookingNumber: 'BK-2026-8801', invoiceType: 'B2B', invoiceNo: 'INV-001', invoiceDate: '2026-07-02', hsnCode: '996311', customerName: 'Vertex Corp', gstIn: '07AAAAA1111A1Z1', subTotal5: 5000, subTotal18: 20000, subTotalAll: 25000 }];
    this.filteredRowData = [...this.rowData];
  }
  loadRoomCheckoutMockRecords(): void {
    this.rowData = [{ bookingNumber: 'BK-2026-1011', customerName: 'Vikram Malhotra', roomNo: '104', roomType: 'Executive Suite', noOfPax: '2 Adults', checkInDate: '2026-07-01', checkOutDate: '2026-07-05', bookingStatus: 'Checked In', remarks: 'Requires checkout' }];
    this.filteredRowData = [...this.rowData];
  }
  loadPoliceMockRecords(): void {
    this.rowData = [
      { guestName: 'Mr. Srimanta Chakraborty', guestAge: '28', nationality: 'India', noOfGuests: 3, address: 'Barasat, North 24 Pgs', contactNo: '9674386300', arrivedFrom: 'Kolkata', probableDestination: 'Varanasi Local', roomNo: '101', checkedInTime: '2026-04-27 15:27', checkedOutTime: '2026-04-27 18:19' },
      { guestName: 'Ms. Ashrita Dutta', guestAge: '24', nationality: 'India', noOfGuests: 5, address: 'Saltlake Sec-V', contactNo: '7899999999', arrivedFrom: 'Durgapur', probableDestination: 'Gaya Junction', roomNo: '304', checkedInTime: '2026-04-27 18:28', checkedOutTime: '2026-04-27 18:31' }
    ];
    this.filteredRowData = [...this.rowData];
  }
  loadTransactionMockRecords(): void {
    this.rowData = [
      { bookingNumber: 'BK-2026-1201', bookingDate: '2026-07-01', totalAmount: 18500, paidAmount: 18500, primaryGuest: 'Rahul Sharma', mobileNumber: '9876543210', bookingSource: 'Direct Website', customerName: 'Rahul Sharma' },
      { bookingNumber: 'BK-2026-1202', bookingDate: '2026-07-02', totalAmount: 24000, paidAmount: 12000, primaryGuest: 'Amit Patel', mobileNumber: '9123456789', bookingSource: 'MakeMyTrip', customerName: 'Amit Patel' }
    ];
    this.filteredRowData = [...this.rowData];
  }

  executeFilterSearch(): void {
    if (this.reportTypeKey === 'booking') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterBookingStatus && item.bookingStatus !== this.filterBookingStatus) return false;
        if (this.filterPaymentStatus && item.paymentStatus !== this.filterPaymentStatus) return false;
        return true;
      });
    } 
    else if (this.reportTypeKey === 'meal' || this.reportTypeKey === 'meal_alt') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterFromDate && item.checkInDate < this.filterFromDate) return false;
        if (this.filterToDate && item.checkOutDate > this.filterToDate) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'monthly_summary') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterChooseMonth && item.summaryMonth !== this.filterChooseMonth) return false;
        if (this.filterChooseYear && item.summaryYear !== this.filterChooseYear) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'payment_det') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterPayMode && item.paymentMode !== this.filterPayMode) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'payment_sum') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterSumFromDate && item.paymentDate < this.filterSumFromDate) return false;
        if (this.filterSumToDate && item.paymentDate > this.filterSumToDate) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'daily_occupancy') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterOccFromDate && item.occupancyDate < this.filterOccFromDate) return false;
        if (this.filterOccToDate && item.occupancyDate > this.filterOccToDate) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'available_rooms') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterAvailFromDate && item.availableDate < this.filterAvailFromDate) return false;
        if (this.filterAvailToDate && item.availableDate > this.filterAvailToDate) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'gst_invoice') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterGstType && item.invoiceType !== this.filterGstType) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'checkout_rep') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterChkFromDate && item.checkInDate < this.filterChkFromDate) return false;
        if (this.filterChkToDate && item.checkOutDate > this.filterChkToDate) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'police_rep') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterPolFromDate && item.checkedInTime < this.filterPolFromDate) return false;
        if (this.filterPolToDate && item.checkedOutTime > this.filterPolToDate) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'transaction_rep') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterTxnCustomer && item.customerName !== this.filterTxnCustomer) return false;
        if (this.filterTxnFromDate && item.bookingDate < this.filterTxnFromDate) return false;
        if (this.filterTxnToDate && item.bookingDate > this.filterTxnToDate) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'complementary') {
      this.filteredRowData = this.rowData.filter(item => {
        // Dropdown month/year split tracking context filters layout dynamic checking
        if (this.filterCompStatus !== 'All' && item.bookingStatus !== this.filterCompStatus) return false;
        return true;
      });
    }
    else if (this.reportTypeKey === 'rms_settle') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterRmsStatus && item.isPaid !== this.filterRmsStatus) return false;
        return true;
      });
    }

    this.refreshGridOptionsApi();
  }

  resetFilters(): void {
    this.filterBookingStatus = ''; this.filterPaymentStatus = ''; this.filterCheckIn = ''; this.filterCheckOut = '';
    this.filterCustomerName = ''; this.filterCustomerPhone = ''; this.filterGuestName = ''; this.filterGuestPhone = '';
    this.filterRefBookingNo = ''; this.filterBookingAmount = '';
    this.filterFromDate = ''; this.filterToDate = ''; this.filterMealType = '';
    this.filterChooseMonth = ''; this.filterChooseYear = '';
    this.filterPayServiceFor = ''; this.filterPayBookingStatus = ''; this.filterPayMode = ''; this.filterPayFromDate = ''; this.filterPayToDate = '';
    this.filterSumFromDate = ''; this.filterSumToDate = '';
    this.filterOccFromDate = ''; this.filterOccToDate = '';
    this.filterAvailFromDate = ''; this.filterAvailToDate = '';
    this.filterGstMonth = ''; this.filterGstYear = ''; this.filterGstType = '';
    this.filterChkFromDate = ''; this.filterChkToDate = ''; this.filterChkSearchText = '';
    this.filterPolFromDate = ''; this.filterPolToDate = '';
    this.filterTxnCustomer = ''; this.filterTxnFromDate = ''; this.filterTxnToDate = ''; this.filterTxnSearchText = '';
    
    this.filteredRowData = [...this.rowData];
    // Refresh the grid to reflect the reset filters
    this.filterCompMonth = '04';
    this.filterCompYear = '2026';
    this.filterCompStatus = 'All';

    // Refresh the grid to reflect the reset filters
    this.filterRmsMonth = '';
    this.filterRmsYear = '';
    this.filterRmsStatus = '';

    // Refresh the grid to reflect the reset filters
    this.filterOtaCheckInFrom = '';
    this.filterOtaCheckOutFrom = '';
    
    // Refresh the grid to reflect the reset filters
    this.filterYtmStartFrom = '04-2025';
    this.filterCurrentMonthSelector = '2026-04';

    // Refresh the grid to reflect the reset filters
    this.filterTxnIndCustomer = '';
    this.filterTxnIndFromDate = '2025-10-30';
    this.filterTxnIndToDate = '2026-04-30';
    
    // Refresh the grid to reflect the reset filters4
    this.filterPendingCheckinUpto = '2026-04-30 23:59:59';
    // Refresh the grid to reflect the reset filters5 Advance Payment
    this.filterAdvancePaymentDate = '2026-04-27';

    // Refresh the grid to reflect the reset filters5 Wallet Payment
    // Call inside your existing executeFilterSearch framework logic when reportTypeKey === 'wallet_list'
  // this.isWalletSearched = true; this.loadWalletListMockRecords();
  
  // Inside resetFilters dynamic layout cleanup pipeline tracker row:
  this.filterWalletUptoDate = '2026-04-30';
  this.isWalletSearched = false;
  if (this.reportTypeKey === 'wallet_list') { this.filteredRowData = []; }
  
  // Refresh the grid to reflect the reset filters Meal Details
  this.filterMealFromDate = '2026-04-28';
    this.filterMealTypeDtsl = 'Room with Breakfast';

  // Refresh the grid to reflect the reset filters Payment Pending Report
 this.filterPendingStatus = '';
    this.filterPendingFrom = '';
    this.filterPendingTo = '';
    this.filterPendingCustName = '';
    this.filterPendingCustPhone = '';
    this.filterPendingGuestName = '';
    this.filterPendingGuestPhone = '';
    this.filterPendingRefNo = '';
    this.filterPendingBookingAmt = '';
    this.filterPendingDueAmt = '';
    this.filterPendingIncludeOta = 'No';
    
    // Refresh the grid to reflect the reset filters Payment Pending Report
this.filterCancelledPaymentStatus = '';
    this.filterCancelledFrom = '';
    this.filterCancelledTo = '';
    this.filterCancelledCustName = '';
    this.filterCancelledCustPhone = '';
    this.filterCancelledGuestName = '';
    this.filterCancelledGuestPhone = '';
    this.filterCancelledRefNo = '';
    this.filterCancelledBookingAmt = '';
    this.filterCancelledDueAmt = '';
    this.filterCancelledIncludeOta = 'No';

  // Refresh the grid to reflect the reset filters Purchase Report
  this.filterPurchaseFrom = '2026-04-30';
    this.filterPurchaseTo = '2026-04-30';

    


    this.refreshGridOptionsApi();
  }

  exportCSVData(): void { if (this.gridApi) this.gridApi.exportDataAsCsv(); }
  triggerPrintSheet(): void { window.print(); }
  isColumnHidden(field: string): boolean { return this.gridApi ? !!this.gridApi.getColumnDef(field)?.hide : false; }
  toggleColumnSelectVisibility(field: string): void { if (this.gridApi) this.gridApi.setColumnsVisible([field], !this.isColumnHidden(field)); }

  // 🛠️ Dynamic Grid Utility Action Proxy Handlers (Added to resolve NG9 compilation issues)
  exportGridToCSV(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: `${this.reportTitle || 'report'}_${new Date().getTime()}.csv`
      });
    } else {
      console.warn('AG-Grid API execution engine context is not initialized yet.');
    }
  }

  triggerPrintJobLayout(): void {
    window.print();
  }

  toggleColumnVisibilityPanel(): void {
    if (this.gridApi) {
      // Modern AG-Grid versions-e column level actions sorasori gridApi processor methods handle kore
      const allColumns = this.gridApi.getColumns();
      if (allColumns && allColumns.length > 0) {
        // Example: Prothom toggle field er visibility lookup change logic state inverse proxy setup
        const targetCol = allColumns[0];
        const isVisible = targetCol.isVisible();
        this.gridApi.setColumnsVisible([targetCol], !isVisible);
        console.log(`Column ${targetCol.getColId()} visibility shifted to:`, !isVisible);
      }
    } else {
      console.warn('AG-Grid engine execution API context handles column modifications log pipeline layout.');
    }
  }
}