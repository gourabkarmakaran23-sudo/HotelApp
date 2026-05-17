import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  menuAlign?: 'left' | 'right';
  menuTop?: string;
  menuLeft?: string;
  menuFixed?: boolean;
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

  constructor(private readonly router: Router, private readonly http: HttpClient) {}

  ngOnInit(): void {
    // Try to load bookings from local asset to populate the checkin list
    this.http.get<any[]>('assets/BookingList.json').subscribe({
      next: (data) => {
        if (data && data.length) {
          // map to GuestRow structure — take first few relevant fields if available
          this.guestRows = data.map((d, idx) => ({
            id: idx + 1,
            bookingNumber: d.bookingNumber ?? `0000${idx + 1}`,
            roomType: d.roomType ?? d.roomType ?? '',
            roomNo: Array.isArray(d.roomNo) ? d.roomNo.join(', ') : (d.roomNo ?? ''),
            mealPlan: d.mealPlan ?? d.mealPlan ?? '',
            pak: d.pax ? String(d.pax) : (d.pak ?? ''),
            name: d.name ?? `${d.guestName ?? ''}`,
            mobile: d.mobile ?? d.guestPhone ?? '',
            checkIn: d.checkIn ?? '',
            checkOut: d.checkOut ?? '',
            paidAmt: d.amount ?? 0,
            dueAmt: d.dueAmt ?? 0,
            bookingStatus: d.paymentStatus ?? ''
          }));
        }
      },
      error: () => {
        // keep existing sample rows if asset not found
      }
    });
  }

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

  addGuest(): void {
    this.router.navigateByUrl('/add-guest');
  }

  // Toggle per-row action menu
  toggleRowMenu(row: GuestRow, ev?: MouseEvent): void {
    if (ev) { ev.stopPropagation(); }
    // close others
    this.guestRows.forEach(r => { if (r.id !== row.id) r.showActions = false; });
    const next = !row.showActions;
    row.showActions = next;
    if (next && ev && ev.target) {
      // decide whether to align menu to left or right based on viewport space
      try {
        const btnEl = (ev.target as HTMLElement).closest('.action-dropdown') as HTMLElement || (ev.target as HTMLElement);
        const rect = btnEl.getBoundingClientRect();
        const menuMinWidth = 220; // px (match SCSS min-width)
        // alignment
        if (rect.left + menuMinWidth > window.innerWidth) {
          row.menuAlign = 'left';
        } else {
          row.menuAlign = 'right';
        }
        // compute fixed coordinates so menu is not clipped by ancestor overflow
        const padding = 8;
        const leftCandidate = row.menuAlign === 'right' ? rect.left : rect.right - menuMinWidth;
        const left = Math.max(padding, Math.min(leftCandidate, window.innerWidth - menuMinWidth - padding));
        const top = rect.bottom + 6; // show below button
        row.menuLeft = `${Math.round(left)}px`;
        row.menuTop = `${Math.round(top)}px`;
        row.menuFixed = true;
      } catch {
        row.menuAlign = 'right';
        row.menuFixed = false;
      }
    } else {
      // closing menu
      row.menuFixed = false;
    }
  }

  closeAllMenus(): void {
    this.guestRows.forEach(r => {
      r.showActions = false;
      r.menuFixed = false;
    });
  }

  // Row-level actions
  addGuestRow(row: GuestRow): void {
    this.closeAllMenus();
    this.router.navigateByUrl('/add-guest');
  }

  checkOutRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Check out ${row.name}`);
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

  guestCheckinModeRow(row: GuestRow): void {
    this.closeAllMenus();
    alert(`Guest Checkin Mode for ${row.roomNo}`);
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
    alert(`Print guest ${row.name}`);
  }

  rowView(row: GuestRow): void {
    this.router.navigate(['/guest', row.id]);
  }
}
