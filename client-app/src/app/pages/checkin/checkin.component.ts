import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface GuestRow {
  id: number;
  bookingNumber: string;
  roomType: string;
  roomNo: string;
  mealPlan: string;
  pak: string;
  name: string;
  mobile: string;
  checkIn: string;
  checkOut: string;
  paidAmt: number;
  dueAmt: number;
  bookingStatus: string;
  showActions?: boolean;
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
    {
      id: 1,
      bookingNumber: '00002706',
      roomType: 'EV, EV',
      roomNo: '304, 201',
      mealPlan: 'EP, EP',
      pak: '6',
      name: 'Mr. Arjun Roy',
      mobile: '9999999999',
      checkIn: '07-05-2026 12:18',
      checkOut: '08-05-2026 10:00',
      paidAmt: 20000,
      dueAmt: 31827.00,
      bookingStatus: 'Check In'
    },
    {
      id: 2,
      bookingNumber: '00002702',
      roomType: 'FV',
      roomNo: '202, 203',
      mealPlan: 'CP, CP',
      pak: '4',
      name: 'Mr. Karan Ghosh',
      mobile: '9999999999',
      checkIn: '06-05-2026 15:55',
      checkOut: '08-05-2026 10:00',
      paidAmt: 7000,
      dueAmt: 21728.00,
      bookingStatus: 'Check In'
    }
  ];

  get filteredRows(): GuestRow[] {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      return this.guestRows;
    }
    return this.guestRows.filter((row) =>
      row.roomNo.includes(search) ||
      row.name.toLowerCase().includes(search) ||
      row.bookingNumber.includes(search) ||
      row.mobile.includes(search) ||
      row.roomType.toLowerCase().includes(search)
    );
  }
  constructor(private readonly router: Router) {}

  addGuest(): void {
    this.router.navigate(['/add-guest']);
  }

  // Toggle per-row action menu
  toggleRowMenu(row: GuestRow, ev?: MouseEvent): void {
    if (ev) { ev.stopPropagation(); }
    // close others
    this.guestRows.forEach(r => { if (r.id !== row.id) r.showActions = false; });
    row.showActions = !row.showActions;
  }

  closeAllMenus(): void {
    this.guestRows.forEach(r => r.showActions = false);
  }

  // Row-level actions
  addGuestRow(row: GuestRow): void {
    this.closeAllMenus();
    this.router.navigate(['/add-guest'], { state: { roomNo: row.roomNo } });
  }

  checkOutRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Check out ${row.firstName} ${row.lastName}`);
  }

  cancelReservationRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Cancel reservation for ${row.roomNo}`);
  }

  amenityAddRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Add amenity for ${row.roomNo}`);
  }

  roomAlterRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Room alter for ${row.roomNo}`);
  }

  paymentRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Payment for ${row.roomNo}`);
  }

  upgradeRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Upgrade room ${row.roomNo}`);
  }

  gtcFormRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`GTC form for ${row.roomNo}`);
  }

  guestCheckinPhotoRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Open guest checkin photo for ${row.roomNo}`);
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
    this.router.navigate(['/guest', row.id]);
  }
}
