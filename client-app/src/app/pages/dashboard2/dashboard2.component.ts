import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

interface HotelRoom {
  id?: number;
  roomNo: string;
  type: string;
  status: 'Occupied' | 'Vacant' | 'Blocked' | 'Arrived' | 'StayOver' | 'DueOut' | 'Dirty' | 'Cleaned' | string;
  guestName?: string;
  duration?: string;
  housekeeping: 'Dirty' | 'Cleaned' | string;
  bookingId?: number;
}

@Component({
  selector: 'app-dashboard2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit, OnDestroy {
  @ViewChild('overviewChartCanvas') overviewChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('availabilityChartCanvas') availabilityChartCanvas!: ElementRef<HTMLCanvasElement>;

  private overviewChart: any;
  private availabilityChart: any;

  selectedRoomType: string = 'All Room Types';
  selectedFloor: string = 'All Floors';
  activeFilterTab: string = 'All';

  // Context Menu State
  isContextMenuVisible: boolean = false;
  contextMenuPos = { x: 0, y: 0 };
  selectedContextRoom: HotelRoom | null = null;

  // Fallback / Initial Sample Rooms Matrix Data
  defaultRoomsList: HotelRoom[] = [
    { roomNo: '101', type: 'DELUXE', status: 'Arrived', guestName: 'John Matthews', duration: 'Nov 22 - Nov 23', housekeeping: 'Dirty', bookingId: 1 },
    { roomNo: '102', type: 'DELUXE', status: 'Arrived', guestName: 'John Matthews', duration: 'Nov 22 - Nov 23', housekeeping: 'Dirty', bookingId: 1 },
    { roomNo: '103', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '104', type: 'DELUXE', status: 'StayOver', guestName: 'Iris Reddy', duration: 'Nov 17 - Nov 23', housekeeping: 'Dirty', bookingId: 2 },
    { roomNo: '105', type: 'DELUXE', status: 'Arrived', guestName: 'Suprobhat Paul', duration: 'Nov 22 - Nov 23', housekeeping: 'Dirty', bookingId: 3 },
    { roomNo: '106', type: 'DELUXE', status: 'Vacant', housekeeping: 'Dirty' },
    { roomNo: '107', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '108', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '109', type: 'DELUXE', status: 'StayOver', guestName: 'Chandana Baishya', duration: 'Nov 20 - Nov 25', housekeeping: 'Dirty', bookingId: 4 },
    { roomNo: '110', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '201', type: 'DELUXE', status: 'Vacant', housekeeping: 'Dirty' },
    { roomNo: '202', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '206', type: 'DELUXE', status: 'Arrived', guestName: 'Deepak Kumar', duration: 'Nov 22 - Nov 23', housekeeping: 'Dirty', bookingId: 5 },
    { roomNo: '302', type: 'EXECUTIVE', status: 'Arrived', guestName: 'Prolay Sil', duration: 'Nov 21 - Nov 23', housekeeping: 'Dirty', bookingId: 6 },
    { roomNo: '408', type: 'EXECUTIVE', status: 'StayOver', guestName: 'Soumi Mondal', duration: 'Nov 21 - Nov 23', housekeeping: 'Dirty', bookingId: 7 }
  ];

  roomsList: HotelRoom[] = [...this.defaultRoomsList];

  // Fallback / Initial Today's Arrivals
  arrivalsList = [
    { guestName: 'James White', phoneNo: '9807899989', roomNo: '106', reservationNo: '00940', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' },
    { guestName: 'Harry Watson', phoneNo: '90909089', roomNo: '108', reservationNo: '00941', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' },
    { guestName: 'James Watson', phoneNo: '90909087', roomNo: '110', reservationNo: '00942', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' },
    { guestName: 'James Watson', phoneNo: '90907878', roomNo: '201', reservationNo: '00943', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' },
    { guestName: 'Robert Clesse', phoneNo: '90909088', roomNo: '205', reservationNo: '00944', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' }
  ];

  // Dynamic Tile Counters
  metrics = {
    occupiedRooms: 17,
    vacantRooms: 19,
    expectedArrival: 7,
    expectedDeparture: 0,
    todaysCheckedIn: 12,
    inHouseGuests: 39
  };

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.recalculateMetrics();
    this.fetchRealDashboardData();

    setTimeout(() => {
      this.initOverviewChart();
      this.initAvailabilityChart();
    }, 50);
  }

  fetchRealDashboardData(): void {
    this.http.get<any>('http://localhost:5287/api/rooms').subscribe({
      next: (res) => {
        // Unwraps direct array or paged API responses
        const data = Array.isArray(res) ? res : (res?.data || res?.items || res?.$values || []);
        if (data && data.length > 0) {
          this.roomsList = data;
          this.recalculateMetrics();
        }
      },
      error: (err) => {
        console.warn('API unavailable or failed, using demo data fallback:', err);
      }
    });
  }

  recalculateMetrics(): void {
    const vacantCount = this.roomsList.filter(r => r.status === 'Vacant').length;
    const occupiedCount = this.roomsList.filter(r => r.status === 'Arrived' || r.status === 'StayOver' || r.status === 'Occupied').length;

    this.metrics.vacantRooms = vacantCount || 19;
    this.metrics.occupiedRooms = occupiedCount || 17;
  }

  // Right-Click Context Menu Trigger
  onRoomRightClick(event: MouseEvent, room: HotelRoom): void {
    event.preventDefault();
    this.selectedContextRoom = room;
    this.contextMenuPos = { x: event.clientX, y: event.clientY };
    this.isContextMenuVisible = true;
  }

  @HostListener('document:click')
  closeContextMenu(): void {
    this.isContextMenuVisible = false;
  }

  // Context Menu Action Handlers
  triggerAction(actionName: string): void {
    this.isContextMenuVisible = false;
    const room = this.selectedContextRoom;

    switch (actionName) {
      case 'Edit Reservation':
      case 'View Reservation':
        if (room?.bookingId) {
          this.router.navigate(['/booking-engine'], { queryParams: { id: room.bookingId, mode: 'edit' } });
        } else {
          this.router.navigate(['/booking-list']);
        }
        break;

      case 'Checkout This Room':
        this.router.navigate(['/checkout']);
        break;

      case 'View Guests & Photos':
        if (room?.bookingId) {
          this.router.navigate(['/guest', room.bookingId]);
        } else {
          this.router.navigate(['/add-guest']);
        }
        break;

      case 'Shift Room':
      case 'Allot More Rooms':
        this.router.navigate(['/room-status']);
        break;

      case 'Edit HK Remarks':
        this.router.navigate(['/housekeeping/room-cleaning']);
        break;

      default:
        console.log(`Action "${actionName}" clicked for Room:`, room);
        break;
    }
  }

  get filteredRooms(): HotelRoom[] {
    return this.roomsList.filter(room => {
      const matchesType = this.selectedRoomType === 'All Room Types' || room.type === this.selectedRoomType.toUpperCase();
      const matchesFloor = this.selectedFloor === 'All Floors' || room.roomNo.startsWith(this.selectedFloor.charAt(0));

      let matchesTab = true;
      if (this.activeFilterTab === 'Occupied') matchesTab = (room.status === 'Arrived' || room.status === 'StayOver' || room.status === 'Occupied');
      else if (this.activeFilterTab === 'Vacant') matchesTab = (room.status === 'Vacant');
      else if (this.activeFilterTab === 'Arrived') matchesTab = (room.status === 'Arrived');
      else if (this.activeFilterTab === 'Stay Over') matchesTab = (room.status === 'StayOver');

      return matchesType && matchesFloor && matchesTab;
    });
  }

  ngOnDestroy(): void {
    if (this.overviewChart) this.overviewChart.destroy();
    if (this.availabilityChart) this.availabilityChart.destroy();
  }

  private initOverviewChart(): void {
    const ctx = this.overviewChartCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;
    this.overviewChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Vacant', 'Occupied', 'Blocked'],
        datasets: [{ data: [19, 17, 4], backgroundColor: ['#10b981', '#ef4444', '#6b7280'] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  private initAvailabilityChart(): void {
    const ctx = this.availabilityChartCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;
    this.availabilityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['22/11', '23/11', '24/11', '25/11', '26/11'],
        datasets: [{ label: 'Rooms Available', data: [14, 30, 31, 38, 38], backgroundColor: '#22d3ee' }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // Toggle context menu on 3-dots button click
  toggleCardMenu(event: MouseEvent, room: HotelRoom): void {
    event.stopPropagation(); // Prevents document click listener from instantly hiding the menu
    
    this.selectedContextRoom = room;
    
    // Position menu directly below the 3-dots button
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    this.contextMenuPos = {
      x: rect.left - 130, // Offsets menu so it opens nicely below/left of the dots
      y: rect.bottom + 6
    };
    
    this.isContextMenuVisible = true;
  }
}