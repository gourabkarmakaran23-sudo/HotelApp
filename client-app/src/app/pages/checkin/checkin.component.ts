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
  pax: string;
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
export class CheckinComponent implements OnInit {

  apiUrl = 'http://localhost:5287/api/bookings/checkin-list';

  pageSizeOptions = [10, 25, 50];

  pageSize = 10;

  searchText = '';

  bookingNumber = '';

  guestNames: string[] = [];

  guestRows: GuestRow[] = [];

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {

    this.fetchCheckInList();

  }

  fetchCheckInList(): void {

    this.http.get<any[]>(this.apiUrl).subscribe({

      next: (response) => {

        console.log('CHECKIN API RESPONSE:', response);

        this.guestRows = response.map((x: any) => ({

          id: x.reservationId,

          bookingNumber: x.bookingNumber,

          roomType: x.roomType,

          roomNo: x.roomNo,

          mealPlan: x.mealPlan || 'EP',

          pax: x.pax || '',

          name: x.guestName,

          mobile: x.mobile || '',

          checkIn: x.checkInDate,

          checkOut: x.checkOutDate,

          paidAmt: x.paidAmount,

          dueAmt: x.dueAmount,

          bookingStatus: x.bookingStatus

        }));

        if (this.guestRows.length > 0) {

          this.bookingNumber =
            this.guestRows[0].bookingNumber;

          this.guestNames =
            this.guestRows.map(x => x.name);

        }

      },

      error: (err) => {

        console.error(err);

        alert('Failed to load check-in list.');

      }

    });

  }

  get filteredRows(): GuestRow[] {

    const search = this.searchText.trim().toLowerCase();

    if (!search) {

      return this.guestRows;

    }

    return this.guestRows.filter((row) =>

      row.roomNo.toLowerCase().includes(search) ||

      row.name.toLowerCase().includes(search) ||

      row.bookingNumber.toLowerCase().includes(search) ||

      row.mobile.toLowerCase().includes(search) ||

      row.roomType.toLowerCase().includes(search)

    );

  }

  addGuest(): void {

    this.router.navigateByUrl('/add-guest');

  }

  toggleRowMenu(row: GuestRow, ev?: MouseEvent): void {

    if (ev) {

      ev.stopPropagation();

    }

    this.guestRows.forEach(r => {

      if (r.id !== row.id) {

        r.showActions = false;

      }

    });

    const next = !row.showActions;

    row.showActions = next;

    if (next && ev && ev.target) {

      try {

        const btnEl =
          (ev.target as HTMLElement).closest('.action-dropdown') as HTMLElement
          || (ev.target as HTMLElement);

        const rect = btnEl.getBoundingClientRect();

        const menuMinWidth = 220;

        if (rect.left + menuMinWidth > window.innerWidth) {

          row.menuAlign = 'left';

        } else {

          row.menuAlign = 'right';

        }

        const padding = 8;

        const leftCandidate =
          row.menuAlign === 'right'
            ? rect.left
            : rect.right - menuMinWidth;

        const left =
          Math.max(
            padding,
            Math.min(
              leftCandidate,
              window.innerWidth - menuMinWidth - padding
            )
          );

        const top = rect.bottom + 6;

        row.menuLeft = `${Math.round(left)}px`;

        row.menuTop = `${Math.round(top)}px`;

        row.menuFixed = true;

      } catch {

        row.menuAlign = 'right';

        row.menuFixed = false;

      }

    } else {

      row.menuFixed = false;

    }

  }

  closeAllMenus(): void {

    this.guestRows.forEach(r => {

      r.showActions = false;

      r.menuFixed = false;

    });

  }

  addGuestRow(row: GuestRow): void {

    this.closeAllMenus();

    this.router.navigateByUrl('/add-guest');

  }

  checkOutRow(row: GuestRow): void {

    this.closeAllMenus();

    this.router.navigate(['/checkout'], {
      state: { row }
    });

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