import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CustomAlertService } from '../../services/custom-alert.service';

@Component({
  selector: 'app-upcoming-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upcoming-checkin.component.html',
  styleUrls: ['./upcoming-checkin.component.scss']
})
export class UpcomingCheckinComponent implements OnInit {

  bookings: any[] = [];

  filteredBookings: any[] = [];

  searchText = '';

  constructor(
    private bookingService: BookingService,
    private alertService: CustomAlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }
  showViewModal = false;

  selectedBooking: any = null;

  closeModal(): void {

  this.showViewModal = false;

  this.selectedBooking = null;
}

editBooking(id: number): void {

  this.closeModal();

  this.router.navigate(
    ['/booking-engine'],
    {
      queryParams: {
        id: id,
        mode: 'edit'
      }
    }
  );
}

  loadBookings(): void {

    this.bookingService.getUpcomingCheckins()
      .subscribe({

        next: (res) => {

          this.bookings = res;

          this.filteredBookings = [...this.bookings];
        },

        error: (err) => {

          console.error(err);

          this.alertService.error(
            'Failed to load upcoming checkins.'
          );
        }
      });
  }

  onSearch(event: Event): void {

    const value =
      (event.target as HTMLInputElement)
        .value
        .toLowerCase()
        .trim();

    this.searchText = value;

    if (!value) {

      this.filteredBookings = [...this.bookings];

      return;
    }

    this.filteredBookings =
      this.bookings.filter(x =>

        x.bookingNumber?.toLowerCase().includes(value)

        ||

        x.guestName?.toLowerCase().includes(value)

        ||

        x.roomNo?.toLowerCase().includes(value)
      );
  }

  onCheckIn(row: any): void {

    this.alertService.confirm(

      `Check in booking ${row.bookingNumber}?`,

      () => {

        this.bookingService
          .checkInBooking(row.bookingId)
          .subscribe({

            next: () => {

              this.alertService.success(
                'Guest checked in successfully.'
              );

              this.loadBookings();
            },

            error: (err) => {

              console.error(err);

              this.alertService.error(
                'Failed to check in booking.'
              );
            }
          });
      }
    );
  }

 onView(row: any): void {

  console.log('VIEW ROW:', row);

  this.selectedBooking = {

    bookingId: row.bookingId,

    bookingNumber: row.bookingNumber,

    status: row.bookingStatus,

    guestName: row.guestName,

    mobile: row.mobile,

    roomNumbers: row.roomNumbers,

    roomTypes: row.roomTypes,

    checkInDate: row.checkInDate,

    checkOutDate: row.checkOutDate,

    totalAmount: row.totalAmount
  };

  this.showViewModal = true;
}

onEdit(row: any): void {

  this.router.navigate(
    ['/booking-engine'],
    {
      queryParams: {
        id: row.bookingId,
        mode: 'edit'
      }
    }
  );
}
}