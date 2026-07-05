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

  // 📊 NEW: Payment Summary Report Filters (2 Fields)
  filterSumFromDate: string = '';
  filterSumToDate: string = '';

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
  }

  setupBookingGridColumns(): void {
    this.columnDefs = [
      {
        headerName: 'Action',
        field: 'action',
        width: 90,
        pinned: 'left',
        cellRenderer: () => `<button style="background: #3182ce; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight:600; cursor:pointer;">View</button>`
      },
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

  loadBookingMockRecords(): void {
    this.rowData = [
      { bookingNumber: 'BK-2026-0811', bookingDate: '2026-07-01', roomType: 'Deluxe Suite', roomNumber: 'A-204', checkInDate: '2026-07-04', checkOutDate: '2026-07-07', paxDetails: '2A + 1C', mealPlan: 'Room with Breakfast', roomRate: 4500, mealPlanAmount: 600, totalRoomRent: 13500, gstTax: 2430, totalPayment: 16530, customerName: 'Rahul Sharma', customerPhone: '9876543210', guestName: 'Rahul Sharma', guestPhone: '9876543210', bookingStatus: 'Confirmed', paymentStatus: 'Paid' }
    ];
    this.filteredRowData = [...this.rowData];
  }

  loadMealMockRecords(): void {
    this.rowData = [
      { bookingNumber: 'BK-2026-0912', bookingDate: '2026-07-02', roomType: 'Executive Suite', roomNumber: 'B-301', checkInDate: '2026-07-05', checkOutDate: '2026-07-08', paxDetails: '2 Adults', mealPlan: 'Room with Breakfast', mealPlanAmount: 500, totalRoomRent: 12000, gstTax: 2160, totalPayment: 14660 }
    ];
    this.filteredRowData = [...this.rowData];
  }

  loadMonthlySummaryMockRecords(): void {
    this.rowData = [
      { summaryYear: '2026', summaryMonth: 'January', totalBookings: 142, totalRevenue: 639000, totalAdjustment: 12000, avgRevenuePerDay: 20612 }
    ];
    this.filteredRowData = [...this.rowData];
  }

  loadPaymentDetailsMockRecords(): void {
    this.rowData = [
      { bookingNumber: 'BK-2026-4410', receiptNumber: 'REC-99812', merchantTxnNo: 'TXN776100234', paymentDate: '2026-07-01', amountPaid: 15400, roomBill: 12000, foodPaid: 3400, paymentMode: 'UPI', serviceFor: 'Room Booking', customerName: 'Amit Patel', txnDetails: 'Paid via PhonePe Gateway successfully', bookingStatus: 'CheckedIn', roomNumbers: '102, 103' }
    ];
    this.filteredRowData = [...this.rowData];
  }

  loadPaymentSummaryMockRecords(): void {
    this.rowData = [
      { paymentDate: '2026-07-01', cashRoom: 45000, cashFood: 12500, bankRoom: 35000, bankFood: 8000, upiRoom: 89000, upiFood: 22400, debitRoom: 15000, debitFood: 3000, creditRoom: 120000, creditFood: 41000, corporateRoom: 60000, corporateFood: 18000, gmRoom: 0, gmFood: 1500, noteRoom: 4500, noteFood: 0, otaRoom: 75000, otaFood: 0 },
      { paymentDate: '2026-07-02', cashRoom: 32000, cashFood: 9400, bankRoom: 22000, bankFood: 4500, upiRoom: 94000, upiFood: 31000, debitRoom: 8000, debitFood: 1200, creditRoom: 145000, creditFood: 38000, corporateRoom: 45000, corporateFood: 12000, gmRoom: 1200, gmFood: 800, noteRoom: 0, noteFood: 500, otaRoom: 91000, otaFood: 0 }
    ];
    this.filteredRowData = [...this.rowData];
  }

  onGridReady(params: GridReadyEvent): void { this.gridApi = params.api; }
  exportCSVData(): void { if (this.gridApi) this.gridApi.exportDataAsCsv(); }
  triggerPrintSheet(): void { window.print(); }
  isColumnHidden(field: string): boolean { return this.gridApi ? !!this.gridApi.getColumnDef(field)?.hide : false; }
  toggleColumnSelectVisibility(field: string): void { if (this.gridApi) this.gridApi.setColumnsVisible([field], !this.isColumnHidden(field)); }

  executeFilterSearch(): void {
    if (this.reportTypeKey === 'booking') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterBookingStatus && item.bookingStatus !== this.filterBookingStatus) return false;
        if (this.filterPaymentStatus && item.paymentStatus !== this.filterPaymentStatus) return false;
        if (this.filterCheckIn && item.checkInDate !== this.filterCheckIn) return false;
        if (this.filterCheckOut && item.checkOutDate !== this.filterCheckOut) return false;
        if (this.filterCustomerName && !item.customerName?.toLowerCase().includes(this.filterCustomerName.toLowerCase())) return false;
        if (this.filterCustomerPhone && !item.customerPhone?.includes(this.filterCustomerPhone)) return false;
        if (this.filterGuestName && !item.guestName?.toLowerCase().includes(this.filterGuestName.toLowerCase())) return false;
        if (this.filterGuestPhone && !item.guestPhone?.includes(this.filterGuestPhone)) return false;
        if (this.filterRefBookingNo && !item.bookingNumber?.toLowerCase().includes(this.filterRefBookingNo.toLowerCase())) return false;
        if (this.filterBookingAmount && Number(item.totalPayment) !== Number(this.filterBookingAmount)) return false;
        return true;
      });
    } else if (this.reportTypeKey === 'meal' || this.reportTypeKey === 'meal_alt') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterFromDate && item.checkInDate < this.filterFromDate) return false;
        if (this.filterToDate && item.checkOutDate > this.filterToDate) return false;
        if (this.filterMealType && item.mealPlan !== this.filterMealType) return false;
        return true;
      });
    } else if (this.reportTypeKey === 'monthly_summary') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterChooseMonth && item.summaryMonth !== this.filterChooseMonth) return false;
        if (this.filterChooseYear && item.summaryYear !== this.filterChooseYear) return false;
        return true;
      });
    } else if (this.reportTypeKey === 'payment_det') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterPayServiceFor && item.serviceFor !== this.filterPayServiceFor) return false;
        if (this.filterPayBookingStatus && item.bookingStatus !== this.filterPayBookingStatus) return false;
        if (this.filterPayMode && item.paymentMode !== this.filterPayMode) return false;
        if (this.filterPayFromDate && item.paymentDate < this.filterPayFromDate) return false;
        if (this.filterPayToDate && item.paymentDate > this.filterPayToDate) return false;
        return true;
      });
    } else if (this.reportTypeKey === 'payment_sum') {
      this.filteredRowData = this.rowData.filter(item => {
        if (this.filterSumFromDate && item.paymentDate < this.filterSumFromDate) return false;
        if (this.filterSumToDate && item.paymentDate > this.filterSumToDate) return false;
        return true;
      });
    }
  }

  resetFilters(): void {
    this.filterBookingStatus = ''; this.filterPaymentStatus = ''; this.filterCheckIn = ''; this.filterCheckOut = '';
    this.filterCustomerName = ''; this.filterCustomerPhone = ''; this.filterGuestName = ''; this.filterGuestPhone = '';
    this.filterRefBookingNo = ''; this.filterBookingAmount = '';
    this.filterFromDate = ''; this.filterToDate = ''; this.filterMealType = '';
    this.filterChooseMonth = ''; this.filterChooseYear = '';
    this.filterPayServiceFor = ''; this.filterPayBookingStatus = ''; this.filterPayMode = ''; this.filterPayFromDate = ''; this.filterPayToDate = '';
    this.filterSumFromDate = ''; this.filterSumToDate = '';
    this.filteredRowData = [...this.rowData];
  }
}