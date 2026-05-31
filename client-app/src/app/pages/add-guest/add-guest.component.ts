import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CustomAlertService } from '../../services/custom-alert.service';

interface GuestProfile {
  roomNo: string;
  title: string;
  guestFirstName: string;
  guestLastName: string;
  mobile: string;
  gender: string;
  age: number | null;
  idType: string;
  idNumber: string;
}

@Component({
  selector: 'app-add-guest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss']
})
export class AddGuestComponent implements OnInit {
  bookingId: number | null = null;
  bookingDetails: any = null;
  guests: GuestProfile[] = [];

  // Holds individual rooms extracted from the API response array
  availableRooms: string[] = [];

  showAddGuestModal = false;
  isEditMode = false;
  editingIndex: number | null = null;

  guestForm: GuestProfile = {
    roomNo: '',
    title: 'Mr.',
    guestFirstName: '',
    guestLastName: '',
    mobile: '',
    gender: 'Male',
    age: null,
    idType: 'Aadhar Card',
    idNumber: ''
  };

  constructor(
    public readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly bookingService: BookingService,
    private readonly alertService: CustomAlertService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        this.bookingId = +params['bookingId'];
        this.loadLiveBookingData();
      } else {
        this.alertService.error('No valid reservation context was provided.');
      }
    });
  }

  loadLiveBookingData(): void {
    if (!this.bookingId) return;

    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (res: any) => {
        this.bookingDetails = res;

        // 1. Extract all individual rooms assigned to this booking allocation
        if (res.rooms && Array.isArray(res.rooms)) {
          this.availableRooms = res.rooms
            .map((r: any) => String(r.roomNo || r.roomNumber || '').trim())
            .filter((no: string) => no !== '');
        } else {
          this.availableRooms = [];
        }

        const primaryFullName = `${res.guestFirstName || ''} ${res.guestLastName || ''}`.trim() || 'Unknown Guest';

        // 2. Map existing checked-in guests if they exist in the backend
        if (res.bookingGuests && Array.isArray(res.bookingGuests) && res.bookingGuests.length > 0) {
          this.guests = res.bookingGuests.map((g: any) => ({
            roomNo: String(g.roomNo || g.roomNumber || (this.availableRooms[0] || '')).trim(),
            title: g.title || 'Mr.',
            guestFirstName: g.guestFirstName || g.firstName || '',
            guestLastName: g.guestLastName || g.lastName || '',
            mobile: g.mobile || g.billingMobile || res.billingMobile || '',
            gender: g.gender || 'Male',
            age: g.age || null,
            idType: g.idType || 'Aadhar Card',
            idNumber: g.idNumber || ''
          }));
        } else {
          // 3. FIX: If no companion profiles exist yet, create a default entry row for EACH room booked
          if (this.availableRooms.length > 0) {
            this.guests = this.availableRooms.map((roomNum, idx) => ({
              roomNo: roomNum,
              title: 'Mr.',
              // Put the main booker's name on the first room, leave others blank for companions
              guestFirstName: idx === 0 ? (res.guestFirstName || 'Guest') : '',
              guestLastName: idx === 0 ? (res.guestLastName || '') : '',
              mobile: idx === 0 ? (res.billingMobile || '') : '',
              gender: 'Male',
              age: null,
              idType: 'Aadhar Card',
              idNumber: ''
            }));
          } else {
            // Ultimate fallback if rooms array missing completely
            this.guests = [{
              roomNo: 'Assign',
              title: 'Mr.',
              guestFirstName: res.guestFirstName || 'Guest',
              guestLastName: res.guestLastName || '',
              mobile: res.billingMobile || '',
              gender: 'Male',
              age: null,
              idType: 'Aadhar Card',
              idNumber: ''
            }];
          }
          // Your existing typescript block expects exactly what we just built:
          if (res.bookingGuests && Array.isArray(res.bookingGuests) && res.bookingGuests.length > 0) {
            this.guests = res.bookingGuests.map((g: any) => ({
              roomNo: String(g.roomNo || g.roomNumber || (this.availableRooms[0] || '')).trim(),
              title: g.title || 'Mr.',
              // ... maps perfectly from the newly added fields now.
            }));
          }
        }

        if (this.bookingDetails) {
          this.bookingDetails.guestName = primaryFullName;
          this.bookingDetails.mobile = res.billingMobile || '';
        }
      },
      error: (err) => {
        console.error(err);
        this.alertService.error('Failed to parse backend data structure correctly.');
      }
    });

  }

  openAddGuestModal(): void {
    this.isEditMode = false;
    this.editingIndex = null;
    this.clearForm();

    // Default to the first room item in the list allocation
    if (this.availableRooms.length > 0) {
      this.guestForm.roomNo = this.availableRooms[0];
    }
    this.showAddGuestModal = true;
  }

  editGuest(index: number): void {
    this.isEditMode = true;
    this.editingIndex = index;
    // Deep copy form properties to populate all input text models perfectly on edit
    this.guestForm = {
      roomNo: String(this.guests[index].roomNo || '').trim(),
      title: this.guests[index].title || 'Mr.',
      guestFirstName: this.guests[index].guestFirstName || '',
      guestLastName: this.guests[index].guestLastName || '',
      mobile: this.guests[index].mobile || '',
      gender: this.guests[index].gender || 'Male',
      age: this.guests[index].age || null,
      idType: this.guests[index].idType || 'Aadhar Card',
      idNumber: this.guests[index].idNumber || ''
    };
    this.showAddGuestModal = true;
  }

  saveGuestSubmit(): void {
    if (!this.guestForm.guestFirstName.trim() || !this.guestForm.mobile.trim()) {
      this.alertService.error('First name and mobile details are mandatory parameters.');
      return;
    }

    if (this.isEditMode && this.editingIndex !== null) {
      this.guests[this.editingIndex] = { ...this.guestForm };
      this.alertService.success('Guest parameters updated successfully.');
    } else {
      this.guests.push({ ...this.guestForm });
      this.alertService.success('Companion profile row added.');
    }
    this.closeGuestModal();
  }

  deleteGuest(index: number): void {
    this.alertService.confirm('Are you sure you want to remove this profile row?', () => {
      this.guests.splice(index, 1);
      this.alertService.success('Guest entry removed.');
    });
  }

  closeGuestModal(): void {
    this.showAddGuestModal = false;
    this.clearForm();
  }

  clearForm(): void {
    this.guestForm = {
      roomNo: this.availableRooms.length > 0 ? this.availableRooms[0] : '',
      title: 'Mr.',
      guestFirstName: '',
      guestLastName: '',
      mobile: '',
      gender: 'Male',
      age: null,
      idType: 'Aadhar Card',
      idNumber: ''
    };
  }
}