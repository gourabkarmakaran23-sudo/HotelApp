import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface GuestRow {
  id: number;
  roomNo: string;
  firstName: string;
  lastName: string;
  mobile: string;
  status: string;
}

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent {
  pageSizeOptions = [10, 25, 50];
  pageSize = 10;
  searchText = '';

  bookingNumber = '00002706';
  guestNames = ['Dr. Sneha Singh', 'Mr. Arjun Roy'];

  guestRows: GuestRow[] = [
    { id: 1, roomNo: '304', firstName: 'Mr. Arjun', lastName: 'Roy', mobile: '9999999999', status: 'Checked In' },
    { id: 2, roomNo: '201', firstName: 'Mr. Karan', lastName: 'Ghosh', mobile: '9999999999', status: 'Checked In' }
  ];

  get filteredRows(): GuestRow[] {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      return this.guestRows;
    }
    return this.guestRows.filter((row) =>
      row.roomNo.includes(search) ||
      row.firstName.toLowerCase().includes(search) ||
      row.lastName.toLowerCase().includes(search) ||
      row.mobile.includes(search)
    );
  }

  addGuest(): void {
    alert('Add Guest action');
  }

  print(): void {
    window.print();
  }

  view(): void {
    alert('View guest details');
  }

  cancelReservation(): void {
    alert('Cancel reservation');
  }

  payment(): void {
    alert('Payment action');
  }

  gtcForm(): void {
    alert('GTC form action');
  }

  checkOut(): void {
    alert('Check Out action');
  }

  rowPrint(row: GuestRow): void {
    alert(`Print guest ${row.firstName} ${row.lastName}`);
  }

  rowView(row: GuestRow): void {
    alert(`View guest ${row.firstName} ${row.lastName}`);
  }
}
