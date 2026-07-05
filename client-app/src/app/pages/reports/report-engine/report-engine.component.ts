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

  // 🚪 Room Checkout Report Filters (3 Fields - Added and Protected)
  filterChkFromDate: string = '';
  filterChkToDate: string = '';
  filterChkSearchText: string = '';

  // 🚓 Police Report Filters (2 Fields - Added and Protected)
  filterPolFromDate: string = '';
  filterPolToDate: string = '';

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
    
    this.filteredRowData = [...this.rowData];
    this.refreshGridOptionsApi();
  }

  exportCSVData(): void { if (this.gridApi) this.gridApi.exportDataAsCsv(); }
  triggerPrintSheet(): void { window.print(); }
  isColumnHidden(field: string): boolean { return this.gridApi ? !!this.gridApi.getColumnDef(field)?.hide : false; }
  toggleColumnSelectVisibility(field: string): void { if (this.gridApi) this.gridApi.setColumnsVisible([field], !this.isColumnHidden(field)); }
}