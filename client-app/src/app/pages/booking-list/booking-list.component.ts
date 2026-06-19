import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Enforce HttpClient usage
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  ValueFormatterParams,
  ModuleRegistry,
  ClientSideRowModelModule,
} from 'ag-grid-community';
import { RoomTypeService } from '../../services/room-type.service';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

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

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridAngular],
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  private gridApi!: GridApi;
  private apiUrl = 'http://localhost:5287/api/bookings'; // Base Web API URL

  roomTypes: any[] = [];
  allData: Booking[] = [];
  rowData: Booking[] = [];
  filteredRowCount: number = 0;
  pageSize = 10;
  showColPanel = false;
  quickFilter = '';

  filters = {
    checkInFrom: '',
    checkOutTo: '',
    customerName: '',
    guestName: '',
    refBookingNo: '',
    paymentStatus: ''
  };

  // Keep column declarations matching your styling exactly
  columnDefs: ColDef[] = [
    { field: 'bookingNumber', headerName: 'Booking No', width: 120, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'bookingDate', headerName: 'Booking Date', width: 120 },
    { field: 'roomType', headerName: 'Room Type', width: 140 },
    { field: 'roomNo', headerName: 'Room No', width: 100 },
    { field: 'mealPlan', headerName: 'Meal Plan', width: 120 },
    { field: 'pax', headerName: 'Pax', width: 80 },
    { field: 'name', headerName: 'Customer Name', width: 160 },
    { field: 'mobile', headerName: 'Mobile', width: 130 },
    { field: 'guestName', headerName: 'Guest Name', width: 160 },
    { field: 'guestPhone', headerName: 'Guest Phone', width: 130 },
    {
      field: 'checkIn',
      headerName: 'Check In',
      width: 150,
      valueFormatter: (p: ValueFormatterParams) => this.formatDateTime(p.value)
    },
    {
      field: 'checkOut',
      headerName: 'Check Out',
      width: 150,
      valueFormatter: (p: ValueFormatterParams) => this.formatDateTime(p.value)
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      width: 120,
      cellRenderer: (params: ICellRendererParams) => {
        const val = params.value || 'Unpaid';
        let badgeClass = 'badge-unpaid';
        if (val.toLowerCase() === 'paid') badgeClass = 'badge-paid';
        if (val.toLowerCase() === 'partiallypaid') badgeClass = 'badge-partial';
        return `<span class="badge ${badgeClass}">${val}</span>`;
      }
    },
    {
      field: 'amount',
      headerName: 'Total Amt',
      width: 110,
      valueFormatter: (p: ValueFormatterParams) => p.value ? `₹${p.value}` : '₹0'
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  toggleableColumns: ToggleableColumn[] = [];

  constructor(private router: Router, private http: HttpClient,
     private roomTypeService: RoomTypeService
  ) {}

  ngOnInit(): void {
    this.setupColumnTogglePanel();
    this.fetchBookingsFromApi(); // Trigger load sequence
     this.loadRoomTypes();
  }

  loadRoomTypes(): void {

  this.http.get<any>('http://localhost:5287/api/RoomType')
    .subscribe({

      next: (response) => {

        console.log('FULL ROOM TYPE RESPONSE:', response);

        this.roomTypes =
          response.items ||
          response.data ||
          response.$values ||
          response;

        console.log('ROOM TYPES FINAL:', this.roomTypes);

        this.fetchBookingsFromApi();
      },

      error: (err) => {
        console.error(err);
      }

    });
}

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

//   fetchBookingsFromApi(): void {

//   this.http.get<any>(this.apiUrl).subscribe({

//     next: (response) => {

//       console.log('API DATA:', response);

//       // Handles both direct array and paged API response
//       const bookings = response.items || response;

//      const mappedBookings = bookings.map((booking: any) => {

//   console.log('BOOKING:', booking);
//   console.log('ROOM TYPES:', this.roomTypes);

//   const matchedRoomType = this.roomTypes.find(
//     (x: any) =>
//       Number(x.id) === Number(booking.roomType) ||
//       Number(x.id) === Number(booking.roomTypeId)
//   );

//   return {

//     ...booking,

//     roomType: matchedRoomType
//       ? matchedRoomType.name
//       : 'Unknown'

//   };

// });
   
//       this.allData = mappedBookings;
//       this.rowData = mappedBookings;
//       this.filteredRowCount = mappedBookings.length;

//     },

//     error: (err) => {

//       console.error('Failed fetching data from database:', err);

//       alert('Could not pull real reservations. Verify your local database engine is running.');

//     }

//   });

// }
 

fetchBookingsFromApi(): void {

  this.http.get<any>(this.apiUrl).subscribe({

    next: (response) => {

      console.log('API DATA:', response);

      const bookings = response.items || response;

      this.allData = bookings;

      this.rowData = bookings;

      this.filteredRowCount = bookings.length;
    },

    error: (err) => {

      console.error('Failed fetching data from database:', err);

      alert(
        'Could not pull real reservations. Verify your local database engine is running.'
      );

    }

  });

}
  // Hook filters to apply seamlessly against live context rows
  applyFilters(): void {
    let data = [...this.allData];

    if (this.filters.checkInFrom) {
      data = data.filter(b => b.checkIn.startsWith(this.filters.checkInFrom));
    }
    if (this.filters.checkOutTo) {
      data = data.filter(b => b.checkOut.startsWith(this.filters.checkOutTo));
    }
    if (this.filters.customerName) {
      const q = this.filters.customerName.toLowerCase();
      data = data.filter(b => b.name.toLowerCase().includes(q));
    }
    if (this.filters.guestName) {
      const q = this.filters.guestName.toLowerCase();
      data = data.filter(b => b.guestName.toLowerCase().includes(q));
    }
    if (this.filters.paymentStatus) {
      data = data.filter(b => b.paymentStatus.toLowerCase() === this.filters.paymentStatus.toLowerCase());
    }
    if (this.filters.refBookingNo) {
      data = data.filter(b => b.bookingNumber.toLowerCase().includes(this.filters.refBookingNo.toLowerCase()));
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

  setupColumnTogglePanel(): void {
    this.toggleableColumns = this.columnDefs
      .filter(c => c.field)
      .map(c => ({ field: c.field!, headerName: c.headerName || c.field!, visible: true }));
  }

  toggleColumn(col: ToggleableColumn): void {
    col.visible = !col.visible;
    this.gridApi?.setColumnsVisible([col.field], col.visible);
  }

  onQuickFilterChange(): void {
    this.gridApi?.setGridOption('quickFilterText', this.quickFilter);
  }

  exportCSV(): void {
    this.gridApi?.exportDataAsCsv();
  }

  onPageSizeChange(): void {
  if (this.gridApi) {
    this.gridApi.paginationSetPageSize(this.pageSize);
  }
}

onPrint(): void {
  window.print();
}

toggleColumnVisibility(): void {
  this.showColPanel = !this.showColPanel;
}

onFilterChanged(): void {
  if (this.gridApi) {
    this.filteredRowCount = this.gridApi.getDisplayedRowCount();
  }
}

onPaginationChanged(): void {
  if (this.gridApi) {
    this.filteredRowCount = this.gridApi.getDisplayedRowCount();
  }
}



  openNewBooking(): void {
    this.router.navigate(['/booking-engine']);
  }

  formatDateTime(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const date = d.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${date} ${time}`;
  }
}