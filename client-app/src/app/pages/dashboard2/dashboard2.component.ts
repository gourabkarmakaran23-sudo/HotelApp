import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

interface HotelRoom {
  roomNo: string;
  type: string;
  status: 'Occupied' | 'Vacant' | 'Blocked' | 'Arrived' | 'StayOver' | 'DueOut' | 'Dirty' | 'Cleaned';
  guestName?: string;
  duration?: string;
  housekeeping: 'Dirty' | 'Cleaned';
}

interface ContextMenuPosition {
  x: number;
  y: number;
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

  // Charts references
  private overviewChart: any;
  private availabilityChart: any;

  // Filter States
  selectedRoomType: string = 'All Room Types';
  selectedFloor: string = 'All Floors';
  activeFilterTab: string = 'All';

  // Context Menu State
  isContextMenuVisible: boolean = false;
  contextMenuPos: ContextMenuPosition = { x: 0, y: 0 };
  selectedContextRoom: HotelRoom | null = null;

  // 1st Layer: Top Summary Tile Metrics Counters
  metrics = {
    occupiedRooms: 17,
    vacantRooms: 19,
    expectedArrival: 7,
    expectedDeparture: 0,
    todaysCheckedIn: 12,
    inHouseGuests: 39
  };

  // 2nd Layer: Rooms Matrix Data Array
  roomsList: HotelRoom[] = [
    { roomNo: '101', type: 'DELUXE', status: 'Arrived', guestName: 'John Matthews', duration: 'Nov 22 - Nov 23', housekeeping: 'Dirty' },
    { roomNo: '102', type: 'DELUXE', status: 'Arrived', guestName: 'John Matthews', duration: 'Nov 22 - Nov 23', housekeeping: 'Dirty' },
    { roomNo: '103', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '104', type: 'DELUXE', status: 'StayOver', guestName: 'Iris Reddy', duration: 'Nov 17 - Nov 23', housekeeping: 'Dirty' },
    { roomNo: '105', type: 'DELUXE', status: 'Arrived', guestName: 'Suprobhat Paul', duration: 'Nov 22 - Nov 23', housekeeping: 'Dirty' },
    { roomNo: '106', type: 'DELUXE', status: 'Vacant', housekeeping: 'Dirty' },
    { roomNo: '107', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '108', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '109', type: 'DELUXE', status: 'StayOver', guestName: 'Chandana Baishya', duration: 'Nov 20 - Nov 25', housekeeping: 'Dirty' },
    { roomNo: '110', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '201', type: 'DELUXE', status: 'Vacant', housekeeping: 'Dirty' },
    { roomNo: '202', type: 'DELUXE', status: 'Vacant', housekeeping: 'Cleaned' },
    { roomNo: '206', type: 'DELUXE', status: 'Arrived', guestName: 'Deepak Kumar', duration: 'Nov 22 - Nov 23', housekeeping: 'Dirty' },
    { roomNo: '302', type: 'EXECUTIVE', status: 'Arrived', guestName: 'Prolay Sil', duration: 'Nov 21 - Nov 23', housekeeping: 'Dirty' },
    { roomNo: '408', type: 'EXECUTIVE', status: 'StayOver', guestName: 'Soumi Mondal', duration: 'Nov 21 - Nov 23', housekeeping: 'Dirty' }
  ];

  // 4th Layer: Today's Arrival Tracking Data Array
  arrivalsList = [
    { guestName: 'James White', phoneNo: '9807899989', roomNo: '106', reservationNo: '00940', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' },
    { guestName: 'Harry Watson', phoneNo: '90909089', roomNo: '108', reservationNo: '00941', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' },
    { guestName: 'James Watson', phoneNo: '90909087', roomNo: '110', reservationNo: '00942', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' },
    { guestName: 'James Watson', phoneNo: '90907878', roomNo: '201', reservationNo: '00943', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' },
    { guestName: 'Robert Clesse', phoneNo: '90909088', roomNo: '205', reservationNo: '00944', arrivalDate: '22/11/2026', arrivalTime: '11:00 AM' }
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    // Generate the charts asynchronously once canvas frames settle into DOM
    setTimeout(() => {
      this.initOverviewChart();
      this.initAvailabilityChart();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.overviewChart) this.overviewChart.destroy();
    if (this.availabilityChart) this.availabilityChart.destroy();
  }

  // Context Menu Processing Handlers
  onRoomRightClick(event: MouseEvent, room: HotelRoom): void {
    event.preventDefault(); // Stop default browser menu
    this.selectedContextRoom = room;
    this.contextMenuPos = {
      x: event.clientX,
      y: event.clientY
    };
    this.isContextMenuVisible = true;
  }

  @HostListener('document:click')
  closeContextMenu(): void {
    this.isContextMenuVisible = false;
  }

  // Menu action router hooks
  triggerAction(actionName: string): void {
    console.log(`Executing ${actionName} context hook for Room:`, this.selectedContextRoom);
    this.isContextMenuVisible = false;
  }

  // Matrix Filter Pipeline Logic
  get filteredRooms(): HotelRoom[] {
    return this.roomsList.filter(room => {
      const matchesType = this.selectedRoomType === 'All Room Types' || room.type === this.selectedRoomType.toUpperCase();
      const matchesFloor = this.selectedFloor === 'All Floors' || room.roomNo.startsWith(this.selectedFloor.charAt(0));
      
      let matchesTab = true;
      if (this.activeFilterTab === 'Occupied') matchesTab = (room.status === 'Arrived' || room.status === 'StayOver');
      else if (this.activeFilterTab === 'Vacant') matchesTab = (room.status === 'Vacant');
      else if (this.activeFilterTab === 'Arrived') matchesTab = (room.status === 'Arrived');
      else if (this.activeFilterTab === 'Stay Over') matchesTab = (room.status === 'StayOver');
      
      return matchesType && matchesFloor && matchesTab;
    });
  }

  // 3rd Layer: Chart Component Setup Rendering Methods
  private initOverviewChart(): void {
    const ctx = this.overviewChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.overviewChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Vacant', 'Occupied', 'Blocked'],
        datasets: [{
          data: [19, 17, 4],
          backgroundColor: ['#10b981', '#ef4444', '#6b7280'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  private initAvailabilityChart(): void {
    const ctx = this.availabilityChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.availabilityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['22/11', '23/11', '24/11', '25/11', '26/11', '27/11', '28/11', '29/11', '30/11', '01/12', '02/12'],
        datasets: [{
          label: 'Rooms Available',
          data: [14, 30, 31, 38, 38, 38, 38, 38, 40, 40, 40],
          backgroundColor: '#22d3ee',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 40 }
        }
      }
    });
  }
}