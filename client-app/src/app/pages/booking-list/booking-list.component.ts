import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  ValueFormatterParams,
  ModuleRegistry,
  ClientSideRowModelModule
} from 'ag-grid-community';

// Register required modules for AG Grid v31
ModuleRegistry.registerModules([ClientSideRowModelModule]);

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface Booking {
  id: number;
  bookingNumber: string;
  bookingDate: string;
  roomType: string;
  roomNo: number | string;
  mealPlan: string;
  pax: number;
  name: string;
  mobile: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  paymentStatus: string;
  amount: number;
}

export interface ToggleableColumn {
  field: string;
  headerName: string;
  visible: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  // Grid
  private gridApi!: GridApi<Booking>;
  rowData: Booking[] = [];
  allData: Booking[] = [];
  filteredRowCount = 0;
  quickFilter = '';
  pageSize = 25;

  // Column panel
  showColPanel = false;

  // Filters
  filters = {
    checkInFrom: '',
    checkOutTo: '',
    customerName: '',
    guestName: '',
    refBookingNo: '',
    paymentStatus: ''
  };

  // ── Column Definitions ──────────────────────────────────────────────────────
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: false,
    minWidth: 80
  };

  columnDefs: ColDef<Booking>[] = [
    {
      headerName: '',
      field: 'id',
      width: 50,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      suppressMenu: true,
      sortable: false,
      filter: false,
      cellClass: 'sno-cell'
    },
    {
      headerName: 'S.',
      valueGetter: 'node.rowIndex + 1',
      width: 55,
      pinned: 'left',
      sortable: false,
      filter: false,
      cellClass: 'sno-cell'
    },
    {
      headerName: 'Booking Number',
      field: 'bookingNumber',
      width: 150,
      pinned: 'left',
      cellRenderer: (p: ICellRendererParams) =>
        `<span class="booking-no">${p.value}</span>`
    },
    {
      headerName: 'Booking Date',
      field: 'bookingDate',
      width: 155
    },
    {
      headerName: 'Room Type',
      field: 'roomType',
      width: 120,
      cellRenderer: (p: ICellRendererParams) =>
        `<span class="room-type-badge">${p.value}</span>`
    },
    {
      headerName: 'Room No.',
      field: 'roomNo',
      width: 100
    },
    {
      headerName: 'Meal Plan',
      field: 'mealPlan',
      width: 110
    },
    {
      headerName: 'Pax',
      field: 'pax',
      width: 70,
      type: 'numericColumn'
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 175,
      cellRenderer: (p: ICellRendererParams) =>
        `<span style="font-weight:600;color:#1a1f36">${p.value}</span>`
    },
    {
      headerName: 'Mobile',
      field: 'mobile',
      width: 130
    },
    {
      headerName: 'Guest Name',
      field: 'guestName',
      width: 165
    },
    {
      headerName: 'Guest Phone',
      field: 'guestPhone',
      width: 130
    },
    {
      headerName: 'Check In',
      field: 'checkIn',
      width: 120
    },
    {
      headerName: 'Check Out',
      field: 'checkOut',
      width: 120
    },
    {
      headerName: 'Amount (₹)',
      field: 'amount',
      width: 130,
      type: 'numericColumn',
      valueFormatter: (p: ValueFormatterParams) => `₹ ${(p.value as number)?.toLocaleString('en-IN')}`,
      cellClass: 'amount-cell'
    },
    {
      headerName: 'Status',
      field: 'paymentStatus',
      width: 120,
      cellRenderer: (p: ICellRendererParams) => {
        const cls = (p.value as string)?.toLowerCase() || '';
        const icons: Record<string, string> = {
          paid: '✓', pending: '⏳', partial: '◑'
        };
        return `<span class="status-badge ${cls}">${icons[cls] || ''} ${p.value}</span>`;
      }
    },
    {
      headerName: 'Action',
      field: 'id',
      width: 120,
      pinned: 'right',
      sortable: false,
      filter: false,
      cellRenderer: (p: ICellRendererParams) => `
        <div class="action-cell">
          <button class="action-btn edit"   title="Edit"   onclick="console.log('edit ${p.value}')">
            <span class="material-icons">edit</span>
          </button>
          <button class="action-btn view"   title="View"   onclick="console.log('view ${p.value}')">
            <span class="material-icons">visibility</span>
          </button>
          <button class="action-btn delete" title="Delete" onclick="console.log('delete ${p.value}')">
            <span class="material-icons">delete_outline</span>
          </button>
        </div>`
    }
  ];

  // Toggleable columns for the visibility panel
  toggleableColumns: ToggleableColumn[] = [
    { field: 'bookingDate',  headerName: 'Booking Date',  visible: true },
    { field: 'roomType',     headerName: 'Room Type',     visible: true },
    { field: 'roomNo',       headerName: 'Room No.',      visible: true },
    { field: 'mealPlan',     headerName: 'Meal Plan',     visible: true },
    { field: 'pax',          headerName: 'Pax',           visible: true },
    { field: 'mobile',       headerName: 'Mobile',        visible: true },
    { field: 'guestName',    headerName: 'Guest Name',    visible: true },
    { field: 'guestPhone',   headerName: 'Guest Phone',   visible: true },
    { field: 'checkIn',      headerName: 'Check In',      visible: true },
    { field: 'checkOut',     headerName: 'Check Out',     visible: true },
    { field: 'amount',       headerName: 'Amount',        visible: true },
    { field: 'paymentStatus',headerName: 'Status',        visible: true }
  ];

  constructor(private http: HttpClient, private readonly router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ── Data ────────────────────────────────────────────────────────────────────
  loadData(): void {
    this.http.get<Booking[]>('assets/BookingList.json').subscribe({
      next: (data) => {
        this.allData = data;
        this.rowData = [...data];
        this.filteredRowCount = data.length;
      },
      error: (err) => console.error('Failed to load BookingList.json', err)
    });
  }

  // ── Grid Events ─────────────────────────────────────────────────────────────
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.filteredRowCount = this.rowData.length;
    params.api.sizeColumnsToFit();
  }

  onFilterChanged(): void {
    this.filteredRowCount = this.gridApi?.getDisplayedRowCount() ?? this.rowData.length;
  }

  onPaginationChanged(): void {
    this.filteredRowCount = this.gridApi?.getDisplayedRowCount() ?? this.rowData.length;
  }

  onQuickFilterChange(): void {
    // quickFilter binding handles this via [quickFilterText]
  }

  onPageSizeChange(): void {
    this.gridApi?.paginationSetPageSize(this.pageSize);
  }

  // ── Filters ─────────────────────────────────────────────────────────────────
  applyFilters(): void {
    let data = [...this.allData];

    if (this.filters.customerName) {
      const q = this.filters.customerName.toLowerCase();
      data = data.filter(b => b.name.toLowerCase().includes(q));
    }
    if (this.filters.guestName) {
      const q = this.filters.guestName.toLowerCase();
      data = data.filter(b => b.guestName.toLowerCase().includes(q));
    }
    if (this.filters.paymentStatus) {
      data = data.filter(b => b.paymentStatus === this.filters.paymentStatus);
    }
    if (this.filters.refBookingNo) {
      data = data.filter(b => b.bookingNumber.includes(this.filters.refBookingNo));
    }

    this.rowData = data;
    this.filteredRowCount = data.length;
  }

  clearFilters(): void {
    this.filters = {
      checkInFrom: '', checkOutTo: '',
      customerName: '', guestName: '',
      refBookingNo: '', paymentStatus: ''
    };
    this.rowData = [...this.allData];
    this.filteredRowCount = this.allData.length;
    this.quickFilter = '';
    this.gridApi?.setFilterModel(null);
  }

  // ── Column Visibility ───────────────────────────────────────────────────────
  toggleColumnVisibility(): void {
    this.showColPanel = !this.showColPanel;
  }

  toggleColumn(col: ToggleableColumn): void {
    col.visible = !col.visible;
    this.gridApi?.setColumnsVisible([col.field], col.visible);
  }

  // ── Export ──────────────────────────────────────────────────────────────────
  exportCSV(): void {
    this.gridApi?.exportDataAsCsv({ fileName: 'BookingList.csv' });
  }

  onPrint(): void {
    window.print();
  }

  openNewBooking(): void {
    this.router.navigate(['/booking-engine']);
  }
}
