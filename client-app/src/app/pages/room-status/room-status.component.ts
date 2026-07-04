import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RoomStatusCard {
  floorName: string;
  roomNo: string;
  roomType: string;
  checkOut: string;
  price: string;
  status: 'Available' | 'Booked';
}

@Component({
  selector: 'app-room-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-status.component.html',
  styleUrls: ['./room-status.component.scss']
})
export class RoomStatusComponent {
  filterDate = this.defaultToday();
  filterStatus = 'All';
  floorName = '';
  searchText = '';

  roomCards: RoomStatusCard[] = [
    { floorName: 'Floor Name 1st Floor', roomNo: '101', roomType: 'Executive Room', checkOut: 'None', price: '0.0', status: 'Available' },
    { floorName: 'Floor Name 1st Floor', roomNo: '103', roomType: 'Executive City View Room', checkOut: '30-04-2026', price: '0.0', status: 'Booked' },
    { floorName: 'Floor Name 1st Floor', roomNo: '102', roomType: 'Executive City View Room', checkOut: '29-04-2026', price: '0.0', status: 'Booked' },
    { floorName: 'Floor Name 1st Floor', roomNo: '108', roomType: 'Executive Room', checkOut: 'None', price: '0.0', status: 'Available' },
    { floorName: 'Floor Name 1st Floor', roomNo: '107', roomType: 'Executive Room', checkOut: 'None', price: '0.0', status: 'Available' },
    { floorName: 'Floor Name 1st Floor', roomNo: '104', roomType: 'Executive Room', checkOut: 'None', price: '0.0', status: 'Available' }
  ];

  get filteredRooms(): RoomStatusCard[] {
    return this.roomCards.filter(card => {
      const statusMatch = this.filterStatus === 'All' || card.status === this.filterStatus;
      const floorMatch = !this.floorName || card.floorName.toLowerCase().includes(this.floorName.toLowerCase());
      const searchMatch = !this.searchText || `${card.roomNo} ${card.roomType} ${card.floorName}`.toLowerCase().includes(this.searchText.toLowerCase());
      return statusMatch && floorMatch && searchMatch;
    });
  }

  defaultToday(): string {
    const now = new Date();
    return now.toISOString().slice(0, 10);
  }
}
