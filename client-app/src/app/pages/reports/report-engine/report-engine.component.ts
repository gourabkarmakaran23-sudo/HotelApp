import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

// Register standard modules for AG-Grid community edition
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
  reportTypeKey: string = '';
  reportTitle: string = '';
  private gridApi!: GridApi;

  // Filter Form Binding Properties (Booking Report Matrix)
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

  // Utility visibility menu control flag
  showVisibilityMenu: boolean = false;

  // AG-Grid Parameters Configuration
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressMovable: false
  };
  
  rowData: any[] = [];
  filteredRowData: any[] = [];

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
      this.reportTitle = '📋 Standard Booking Operational Ledger Report';
      this.setupBookingGridColumns();
      this.loadBookingMockRecords();
    } else {
      // Fallback fallback configuration scaffolding logic for remaining 27 reports
      this.reportTitle = `${this.reportTypeKey.toUpperCase()} Report Archive`;
      this.columnDefs = [
        { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 70 },
        { headerName: 'Data Reference ID', field: 'refId', flex: 1 },
        { headerName: 'Operational Metrics', field: 'metricValue', flex: 1 },
        { headerName: 'Current Status', field: 'status', flex: 1 }
      ];
      this.rowData = [{ refId: 'GEN-REF-8821', metricValue: 'System Log Base Payload', status: 'Verified Active' }];
      this.filteredRowData = [...this.rowData];
    }
  }

  setupBookingGridColumns(): void {
  this.columnDefs = [
    {
      headerName: 'Action',
      field: 'action',
      width: 100,
      pinned: 'left',
      filter: false,
      sortable: false,
      cellRenderer: () => {
        return `<button style="background: #3182ce; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight:600; cursor:pointer;">View</button>`;
      }
    },
    { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 65, pinned: 'left' },
    // 🚀 FIXED HERE: Changed fontClass to cellClass
    { headerName: 'Booking Number', field: 'bookingNumber', width: 140, cellClass: 'monospace-font', hide: false },
    { headerName: 'Booking Date', field: 'bookingDate', width: 120, hide: false },
    { headerName: 'Room Type', field: 'roomType', width: 130, hide: false },
    { headerName: 'Room Number', field: 'roomNumber', width: 120, hide: false },
    { headerName: 'Check In', field: 'checkInDate', width: 110, hide: false },
    { headerName: 'Check Out', field: 'checkOutDate', width: 110, hide: false },
    { headerName: 'Pax', field: 'paxDetails', width: 90, hide: false },
    { headerName: 'Meal Plan', field: 'mealPlan', width: 120, hide: false },
    { headerName: 'Room Rate', field: 'roomRate', width: 110, valueFormatter: p => '₹' + p.value, hide: false },
    { headerName: 'Meal Plan Amount', field: 'mealPlanAmount', width: 140, valueFormatter: p => '₹' + p.value, hide: false },
    { headerName: 'Total Room Rent', field: 'totalRoomRent', width: 140, valueFormatter: p => '₹' + p.value, hide: false },
    { headerName: 'GST', field: 'gstTax', width: 100, valueFormatter: p => '₹' + p.value, hide: false },
    { headerName: 'Total Payment', field: 'totalPayment', width: 130, valueFormatter: p => '₹' + p.value, hide: false }
  ];
}
  loadBookingMockRecords(): void {
    // 26 explicit date format mock dataset setup matches schema fields explicitly
    this.rowData = [
      {
        bookingNumber: 'BK-2026-0811',
        bookingDate: '2026-07-01',
        roomType: 'Deluxe Suite Premium',
        roomNumber: 'A-204',
        checkInDate: '2026-07-04',
        checkOutDate: '2026-07-07',
        paxDetails: '2A + 1C',
        mealPlan: 'Continental EP',
        roomRate: 4500,
        mealPlanAmount: 600,
        totalRoomRent: 13500,
        gstTax: 2430,
        totalPayment: 16530,
        customerName: 'Rahul Sharma',
        customerPhone: '9876543210',
        guestName: 'Rahul Sharma',
        guestPhone: '9876543210',
        bookingStatus: 'Confirmed',
        paymentStatus: 'Paid'
      },
      {
        bookingNumber: 'BK-2026-0955',
        bookingDate: '2026-07-03',
        roomType: 'Executive Business Double',
        roomNumber: 'B-501',
        checkInDate: '2026-07-05',
        checkOutDate: '2026-07-10',
        paxDetails: '2 Adults',
        mealPlan: 'MAP Luxury Plan',
        roomRate: 7200,
        mealPlanAmount: 1500,
        totalRoomRent: 36000,
        gstTax: 6480,
        totalPayment: 43980,
        customerName: 'Ananya Sen',
        customerPhone: '8100123456',
        guestName: 'Amit Sen',
        guestPhone: '8100987654',
        bookingStatus: 'CheckedIn',
        paymentStatus: 'Partial'
      }
    ];
    this.filteredRowData = [...this.rowData];
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  executeFilterSearch(): void {
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
  }

  resetFilters(): void {
    this.filterBookingStatus = '';
    this.filterPaymentStatus = '';
    this.filterCheckIn = '';
    this.filterCheckOut = '';
    this.filterCustomerName = '';
    this.filterCustomerPhone = '';
    this.filterGuestName = '';
    this.filterGuestPhone = '';
    this.filterRefBookingNo = '';
    this.filterBookingAmount = '';
    this.filteredRowData = [...this.rowData];
  }

  exportCSVData(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv();
    }
  }

  triggerPrintSheet(): void {
    window.print();
  }

  toggleColumnSelectVisibility(field: string): void {
    if (this.gridApi) {
      const currentVisible = this.gridApi.getColumnDef(field)?.hide;
      this.gridApi.setColumnsVisible([field], !!currentVisible);
    }
  }

  isColumnHidden(field: string): boolean {
    if (!this.gridApi) return false;
    return !!this.gridApi.getColumnDef(field)?.hide;
  }
}