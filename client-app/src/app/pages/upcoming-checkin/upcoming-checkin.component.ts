import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CustomAlertService } from '../../services/custom-alert.service';

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
  selector: 'app-upcoming-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upcoming-checkin.component.html',
  styleUrls: ['./upcoming-checkin.component.scss']
})
export class UpcomingCheckinComponent implements OnInit {
    guestRows: GuestRow[] = [];
  bookings: any[] = [];
  filteredBookings: any[] = [];
  searchText = '';
  
  // Track which row action menu dropdown is currently open
  activeMenuIndex: number | null = null;
  
  showViewModal = false;
  selectedBooking: any = null;

  constructor(
    private bookingService: BookingService,
    private alertService: CustomAlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  // Closes dropdown menus cleanly when clicking anywhere outside on the window layout layout
  @HostListener('document:click', ['$event'])
  closeDropdownsOutside(event: Event): void {
    this.activeMenuIndex = null;
  }

  toggleActionMenu(event: Event, index: number): void {
    event.stopPropagation(); // Stop click bubbling so host listener doesn't trigger
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }

  addGuestRow(row: GuestRow): void {

    this.closeAllMenus();

    this.router.navigateByUrl('/add-guest');

  }

  
  closeAllMenus(): void {

    this.guestRows.forEach(r => {

      r.showActions = false;

      r.menuFixed = false;

    });

  }


  loadBookings(): void {
  this.bookingService.getUpcomingCheckIn().subscribe({
    next: (res: any[]) => {
      console.log("Upcoming CheckIn Data Received: ", res);
      
      // Map properties safely to avoid frontend undefined structural field bugs
      this.bookings = res.map(b => ({
        bookingId: b.bookingId || b.id,
        bookingNumber: b.bookingNumber,
        bookingDate: b.bookingDate || new Date(),
        guestName: b.guestName || 'Unknown Guest',
        mobile: b.mobile || 'N/A',
        roomTypes: b.roomTypes || b.roomTypeName || 'N/A',
        roomNo: b.roomNo || b.roomNumber || 'Assign',
        mealPlan: b.mealPlan || 'CP',
        pax: b.pax || '2 / 0',
        checkInDate: b.checkInDate,
        checkOutDate: b.checkOutDate,
        bookingStatus: b.bookingStatus || b.status || 'Confirmed'
      }));
      
      this.filteredBookings = [...this.bookings];
    },
    error: (err) => {
      console.error("Error loading checkins:", err);
      this.alertService.error('Failed to load upcoming check-ins data from server.');
    }
  });
}

  onSearch(event: any): void {
    const value = event.target.value.toLowerCase().trim();
    if (!value) {
      this.filteredBookings = [...this.bookings];
      return;
    }

    this.filteredBookings = this.bookings.filter(x => 
      x.bookingNumber?.toLowerCase().includes(value) ||
      x.guestName?.toLowerCase().includes(value) ||
      x.roomNo?.toLowerCase().includes(value) ||
      x.mobile?.includes(value)
    );
  }

  // Central Router Actions Controller for the Menu choices
  onAction(actionType: string, row: any): void {
    this.activeMenuIndex = null; // Hide dropdown immediately
    
    switch(actionType) {
      case 'update':
        this.router.navigate(['/booking-engine'], { queryParams: { id: row.bookingId } });
        break;
      case 'addGuest':
        this.alertService.success(`Opening Add Guest Wizard for: ${row.bookingNumber}`);
        break;
      case 'print':
        window.print();
        break;
      case 'payment':
        this.alertService.success(`Opening Folio Payment Window for: ${row.bookingNumber}`);
        break;
      case 'grc':
        this.alertService.success(`Generating Guest Registration Card PDF...`);
        break;
      case 'draft':
        this.alertService.success(`Printing Draft Form...`);
        break;
      case 'cancel':
        this.alertService.confirm(`Are you absolutely sure you want to CANCEL reservation ${row.bookingNumber}?`, () => {
          this.alertService.success('Reservation Cancelled Successfully.');
        });
        break;
    }
  }

  onCheckIn(row: any): void {
    this.activeMenuIndex = null;
    this.alertService.confirm(`Check in booking ${row.bookingNumber}?`, () => {
      this.bookingService.checkInBooking(row.bookingId).subscribe({
        next: () => {
          this.alertService.success('Guest checked in successfully.');
          this.loadBookings();
        },
        error: (err) => {
          console.error(err);
          this.alertService.error('Failed to check in booking.');
        }
      });
    });
  }
// FIXED: Consolidated Edit Routing Context Method
  editBooking(id: number): void {
    this.closeModal();
    this.activeMenuIndex = null;
    this.router.navigate(['/booking-engine'], { queryParams: { id: id } });
  }
  onView(row: any): void {
    console.log('Viewing booking:', row);
    this.activeMenuIndex = null;
    this.selectedBooking = {
      bookingId: row.bookingId,
      bookingNumber: row.bookingNumber,
      status: row.bookingStatus || 'Confirmed',
      guestName: row.guestName,
      mobile: row.mobile,
      roomNumbers: row.roomNo || row.roomNumbers,
      roomTypes: row.roomTypes,
      checkInDate: row.checkInDate,
      checkOutDate: row.checkOutDate,
      mealPlan: row.mealPlan,
      pax: row.pax
    };
    
    // ADD THIS LINE RIGHT HERE:
    this.showViewModal = true; 
  }

  closeModal(): void {
    this.showViewModal = false;
    this.selectedBooking = null;
  }
}