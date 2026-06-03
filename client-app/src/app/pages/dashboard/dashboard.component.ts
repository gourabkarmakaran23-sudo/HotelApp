import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { DashboardSummary, DashboardStats, RoomTypeBookingHistoryRow } from '../../models/dashboard.models';

interface RoomOccupancy {
  roomNumber: string;
  roomId: number;
  [key: string]: any;
}

interface BookingData {
  id: number;
  roomType: string;
  premiumViews: number;
  standardViews: number;
  executiveViews: number;
  executiveNonViews: number;
  familyNonViews: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AgGridAngular],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  // Dashboard state
  summary: DashboardSummary | null = null;
  stats: DashboardStats | null = null;
  roomData: RoomOccupancy[] = [];
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    resizable: true,
    sortable: false,
    filter: false,
    minWidth: 100,
  };

  gridOptions: GridOptions = {
    rowHeight: 40,
    headerHeight: 40,
    suppressHorizontalScroll: false,
    suppressMovableColumns: true
  };

  // Filter state
  fromDate: string = this.getDefaultFromDate();
  toDate: string = this.getDefaultToDate();
  searchRoomNumber: string = '';
  loading: boolean = false;
  error: string = '';

  // Dashboard metrics
  activeBookings = 0;
  totalRevenue = 0;
  occupancyRate = 0;
  pendingRequests = 0;
  totalBookings = 0;
  completedBookings = 0;
  cancelledBookings = 0;
  totalRooms = 0;
  availableRooms = 0;

  historyDates: string[] = [];
  roomTypeHistory: RoomTypeBookingHistoryRow[] = [];

  bookingData: BookingData[] = [
    { id: 1, roomType: 'Premium View', premiumViews: 6, standardViews: 34, executiveViews: 46, executiveNonViews: 60, familyNonViews: 6, total: 14 },
    { id: 2, roomType: 'Standard View', premiumViews: 72, standardViews: 330, executiveViews: 234, executiveNonViews: 330, familyNonViews: 72, total: 59 },
    { id: 3, roomType: 'Executive View', premiumViews: 37, standardViews: 124, executiveViews: 60, executiveNonViews: 124, familyNonViews: 60, total: 54 },
    { id: 4, roomType: 'Executive Non View', premiumViews: 31, standardViews: 120, executiveViews: 60, executiveNonViews: 120, familyNonViews: 60, total: 7 },
    { id: 5, roomType: 'Family Non View', premiumViews: 6, standardViews: 120, executiveViews: 54, executiveNonViews: 180, familyNonViews: 54, total: 15 },
  ];

  get totalPremiumViews(): number {
    return this.bookingData.reduce((sum, r) => sum + r.premiumViews, 0);
  }

  get totalStandardViews(): number {
    return this.bookingData.reduce((sum, r) => sum + r.standardViews, 0);
  }

  get totalExecutiveViews(): number {
    return this.bookingData.reduce((sum, r) => sum + r.executiveViews, 0);
  }

  get totalExecutiveNonViews(): number {
    return this.bookingData.reduce((sum, r) => sum + r.executiveNonViews, 0);
  }

  get totalFamilyNonViews(): number {
    return this.bookingData.reduce((sum, r) => sum + r.familyNonViews, 0);
  }

  get totalBookingsCount(): number {
    return this.bookingData.reduce((sum, r) => sum + r.total, 0);
  }

  menuItems = [
    { icon: '📊', label: 'Dashboard', active: true, route: '/dashboard' },
    { icon: '📋', label: 'Tariff Interface', route: '/tariff' },
    { icon: '👤', label: 'Account', route: '/account' },
    { icon: '🛏️', label: 'Rooms', route: '/rooms' },
    { icon: '💳', label: 'Payment Setting', route: '/payment' },
    { icon: '🛒', label: 'Purchase Manage', route: '/purchase' },
    { icon: '📈', label: 'Reports', route: '/reports' },
    { icon: '🏨', label: 'Room Facilities', route: '/facilities' },
    {
      icon: '📅',
      label: 'Room Reservation',
      open: false,
      children: [
        { label: 'Booking List', route: '/booking-list' },
        { label: 'Upcoming CheckIn', route: '/upcoming-checkin' },
        { label: 'Check In', route: '/checkin' },
        { label: 'Direct Checkout', route: '/direct-checkout' },
        { label: 'Room Status', route: '/room-status' },
        { label: 'Booking Engine', route: '/booking-engine' }
      ]
    },
    { icon: '📦', label: 'Unit and Products', route: '/products' },
    { icon: '🔖', label: 'House Keeping', route: '/housekeeping' },
    { icon: '🛏️', label: 'Room Setting', route: '/room-settings' },
    { icon: '🎫', label: 'Tax Management', route: '/tax' },
    { icon: '💰', label: 'Promo/code Management', route: '/promos' }
  ];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadStats();
    this.loadRoomTypeHistory();
    this.loadOccupancyData();
  }

  private loadSummary(): void {
    this.dashboardService.getSummary().subscribe(
      (summary) => {
        this.summary = summary;
        this.activeBookings = summary.activeBookings;
        this.totalRevenue = summary.revenue;
        this.occupancyRate = summary.occupancyRate;
        this.pendingRequests = summary.pendingRequests;
      },
      (error) => {
        console.error('Error loading summary:', error);
      }
    );
  }

  private loadRoomTypeHistory(): void {
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    this.dashboardService.getRoomTypeBookingHistory(from, to).subscribe(
      (response) => {
        this.historyDates = response.dates;
        this.roomTypeHistory = response.rows;
      },
      (error) => {
        console.error('Error loading room type booking history:', error);
        this.historyDates = [];
        this.roomTypeHistory = [];
      }
    );
  }

  private loadStats(): void {
    this.dashboardService.getStats().subscribe(
      (stats) => {
        this.stats = stats;
        this.totalBookings = stats.totalBookings;
        this.completedBookings = stats.completedBookings;
        this.cancelledBookings = stats.cancelledBookings;
        this.availableRooms = stats.availableRooms;
      },
      (error) => {
        console.error('Error loading booking statistics:', error);
      }
    );
  }

  loadOccupancyData(): void {
    this.loading = true;
    this.error = '';
    
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    // Prefill from local asset so UI shows dummy data immediately during development
    this.dashboardService.getOccupancyFromAsset().subscribe(
      (asset) => {
        if (asset && asset.rooms && asset.rooms.length > 0 && asset.dates) {
          this.roomData = asset.rooms as RoomOccupancy[];
          this.buildColumnDefinitions(asset.dates);
        }
      },
      (assetErr) => {
        // ignore — we'll attempt to fetch from API below or fall back to in-memory generator
        console.warn('Prefill asset failed', assetErr);
      }
    );

    this.dashboardService.getOccupancyGrid(from, to, this.searchRoomNumber).subscribe(
      (response) => {
        console.log('Occupancy data received:', response);
        // If API returned rooms, use them. If rooms is empty, fall back to local asset.
        if (response && response.rooms && response.dates && response.rooms.length > 0) {
          this.roomData = response.rooms;
          this.buildColumnDefinitions(response.dates);
          this.loading = false;
          return;
        }

        console.warn('Occupancy API returned no rooms; falling back to local dummy asset.');
        this.dashboardService.getOccupancyFromAsset().subscribe(
          (asset) => {
            if (asset && asset.rooms && asset.rooms.length > 0 && asset.dates) {
              this.roomData = asset.rooms as RoomOccupancy[];
              this.buildColumnDefinitions(asset.dates);
            } else {
              this.generateDummyRoomData();
            }
            this.loading = false;
          },
          (assetErr) => {
            console.warn('Failed to load local dummy asset, falling back to in-memory dummy', assetErr);
            this.generateDummyRoomData();
            this.loading = false;
          }
        );
      },
      (error) => {
        console.error('Error loading occupancy data:', error);
        this.error = 'Failed to load occupancy data. Using dummy data for now.';
        // Try to load a local dummy JSON asset first (more realistic structure)
        this.dashboardService.getOccupancyFromAsset().subscribe(
          (asset) => {
            if (asset && asset.rooms && asset.dates) {
              this.roomData = asset.rooms as RoomOccupancy[];
              this.buildColumnDefinitions(asset.dates);
            } else {
              this.generateDummyRoomData();
            }
          },
          (assetErr) => {
            console.warn('Failed to load local dummy asset, falling back to in-memory dummy', assetErr);
            this.generateDummyRoomData();
          }
        );
        this.loading = false;
      }
    );
  }

  private generateDummyRoomData(): void {
    const dummyRooms: RoomOccupancy[] = [
      { roomNumber: '401 (FNV)', roomId: 1 },
      { roomNumber: '501 (PV)', roomId: 2 },
      { roomNumber: '502 (ENV)', roomId: 3 },
      { roomNumber: '503 (ENV)', roomId: 4 },
      { roomNumber: '504 (FNV)', roomId: 5 },
      { roomNumber: '601 (FNV)', roomId: 6 },
      { roomNumber: '602 (NV)', roomId: 7 },
      { roomNumber: '603 (NV)', roomId: 8 },
      { roomNumber: '604 (NV)', roomId: 9 },
    ];

    const dates: string[] = [];
    const today = new Date(this.fromDate);
    const endDate = new Date(this.toDate);
    
    while (today <= endDate) {
      const dateKey = today.toISOString().split('T')[0];
      const dateDisplay = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      dates.push(dateDisplay);
      
      today.setDate(today.getDate() + 1);
    }

    // Add dummy data for each room and date
    dummyRooms.forEach((room, roomIdx) => {
      dates.forEach((dateStr) => {
        const statuses = ['CheckIn', 'CheckOut', 'Occupied', 'Available'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        room[dateStr] = { date: dateStr, status: randomStatus };
      });
    });

    this.roomData = dummyRooms;
    this.buildColumnDefinitions(dates);
  }

  private buildColumnDefinitions(dates: string[]): void {
    const cols: ColDef[] = [
      {
        field: 'roomNumber',
        headerName: 'Room No.',
        width: 140,
        pinned: 'left',
        cellStyle: { 
          fontWeight: 'bold',
          backgroundColor: '#f5f5f5',
          textAlign: 'center'
        }
      }
    ];

    // Add column for each date
    dates.forEach((dateStr) => {
      cols.push({
        field: dateStr,
        headerName: dateStr,
        width: 130,
        cellRenderer: this.statusCellRenderer.bind(this),
        cellStyle: this.getStatusCellStyle.bind(this)
      });
    });

    this.columnDefs = cols;
  }

  private statusCellRenderer(params: any): string {
    if (!params.value) {
      return '<div style="text-align: center; color: #999;">-</div>';
    }
    
    const status = params.value.status || '';
    let bgColor = '#e5e7eb';
    let textColor = '#666';
    
    switch (status.toLowerCase()) {
      case 'checkin':
        bgColor = '#2563eb';
        textColor = 'white';
        break;
      case 'checkout':
        bgColor = '#16a34a';
        textColor = 'white';
        break;
      case 'occupied':
        bgColor = '#eab308';
        textColor = '#333';
        break;
      case 'available':
        bgColor = '#e5e7eb';
        textColor = '#666';
        break;
    }
    
    return `<div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: ${bgColor};
      color: ${textColor};
      font-weight: 600;
      font-size: 0.85rem;
      border-radius: 4px;
    ">${status}</div>`;
  }

  private getStatusCellStyle(params: any): any {
    if (!params.value) {
      return {
        backgroundColor: '#f9fafb',
        textAlign: 'center'
      };
    }

    const status = params.value.status || '';
    let bgColor = '#e5e7eb';
    let textColor = '#666';

    switch (status.toLowerCase()) {
      case 'checkin':
        bgColor = '#2563eb';
        textColor = 'white';
        break;
      case 'checkout':
        bgColor = '#16a34a';
        textColor = 'white';
        break;
      case 'occupied':
        bgColor = '#eab308';
        textColor = '#333';
        break;
      case 'available':
        bgColor = '#e5e7eb';
        textColor = '#666';
        break;
    }

    return {
      backgroundColor: bgColor,
      color: textColor,
      textAlign: 'center'
    };
  }

  onFilterClick(): void {
    this.loadRoomTypeHistory();
    this.loadOccupancyData();
  }

  onSearchChange(): void {
    this.loadOccupancyData();
  }

  onMenuItemClick(item: any): void {
    // If the item has children, toggle open/closed
    if (item.children && item.children.length) {
      item.open = !item.open;
      return;
    }

    // Otherwise, activate and navigate if it has a route
    this.menuItems.forEach(m => m.active = false);
    item.active = true;
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  onSubMenuClick(parent: any, sub: any): void {
    // mark parent open and active, and navigate to the sub-route
    this.menuItems.forEach(m => m.active = false);
    parent.active = true;
    parent.open = true;
    if (sub.route) {
      this.router.navigate([sub.route]);
    }
  }

  private getDefaultFromDate(): string {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today.toISOString().split('T')[0];
  }

  private getDefaultToDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split('T')[0];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
