import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RoomService, Room } from '../../services/room.service';
import { BookingService } from '../../services/booking.service';

interface RoomStatusCard {
  floorName: string;
  roomNo: string;
  roomType: string;
  checkOut: string;
  price: string;
  status: 'Available' | 'Booked';
}

interface CheckInListItem {
  RoomNo: string;
  CheckInDate: string;
  CheckOutDate: string;
  BookingStatus: string;
}

@Component({
  selector: 'app-room-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-status.component.html',
  styleUrls: ['./room-status.component.scss']
})
export class RoomStatusComponent implements OnInit {
  filterDate = this.defaultToday();
  filterStatus = 'All';
  floorName = '';
  searchText = '';
  loading = false;
  errorMessage = '';

  roomCards: RoomStatusCard[] = [];

  constructor(
    private readonly roomService: RoomService,
    private readonly bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadRoomStatus();
  }

  loadRoomStatus(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      rooms: this.roomService.getAll(1, 1000, ''),
      checkIns: this.bookingService.getCheckInList()
    }).subscribe({
      next: ({ rooms, checkIns }) => {
        const reservationMap = this.buildReservationMap(checkIns || []);
        this.roomCards = rooms.items.map((room) => this.mapRoomToCard(room, reservationMap));
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load room status from backend. Please check your API connection.';
        this.loading = false;
      }
    });
  }

  private buildReservationMap(checkIns: CheckInListItem[]): Record<string, string> {
    const result: Record<string, string> = {};
    const now = new Date();

    checkIns.forEach((item) => {
      const roomNo = item.RoomNo?.trim();
      if (!roomNo) {
        return;
      }

      const checkInDate = new Date(item.CheckInDate);
      const checkOutDate = new Date(item.CheckOutDate);
      if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
        return;
      }

      if (checkInDate <= now && now < checkOutDate) {
        result[roomNo] = this.formatDate(checkOutDate);
      } else if (!result[roomNo] && checkInDate > now) {
        result[roomNo] = `Next ${this.formatDate(checkOutDate)}`;
      }
    });

    return result;
  }

  private mapRoomToCard(room: Room, reservationMap: Record<string, string>): RoomStatusCard {
    const roomNo = room.roomNumber || 'N/A';
    const checkOutLabel = reservationMap[roomNo] ?? 'None';
    const isAvailable = room.status?.toLowerCase() === 'available' && !reservationMap[roomNo];

    return {
      floorName: room.floorNo ? `Floor ${room.floorNo}` : 'Unknown Floor',
      roomNo,
      roomType: room.roomTypeName || 'Unknown Room Type',
      checkOut: checkOutLabel,
      price: room.price != null ? `₹${room.price.toFixed(2)}` : '₹0.00',
      status: isAvailable ? 'Available' : 'Booked'
    };
  }

  get filteredRooms(): RoomStatusCard[] {
    return this.roomCards.filter(card => {
      const statusMatch = this.filterStatus === 'All' || card.status === this.filterStatus;
      const floorMatch = !this.floorName || card.floorName.toLowerCase().includes(this.floorName.toLowerCase());
      const searchMatch = !this.searchText || `${card.roomNo} ${card.roomType} ${card.floorName}`.toLowerCase().includes(this.searchText.toLowerCase());
      return statusMatch && floorMatch && searchMatch;
    });
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  }

  defaultToday(): string {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  }
}
