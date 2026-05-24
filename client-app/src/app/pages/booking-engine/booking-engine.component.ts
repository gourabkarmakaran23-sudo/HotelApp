import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CustomAlertService } from '../../services/custom-alert.service';
import { CustomAlertComponent } from '../shared/custom-alert/custom-alert.component';
import { RoomTypeService } from '../../services/room-type.service';
import { RoomService } from '../../services/room.service';

interface BookingForm {
  bookingType: string;
  bookingReference: string;
  soldBy: string;
  arrivalFrom: string;
  customerProfile: string;
  purposeOfVisit: string;
  remarks: string;
  checkIn: string;
  checkOut: string;
 roomTypeId: number; // Matches foreign key to RoomTypes entity
  roomType?: any;     // Optional navigation object if included
  roomNo: string;
  mealPlan: string;
  extraChildAge: number;
  adults: number;
  children: number;
  rentPerNight: number;
  complimentaryPerNight: number;
  extraCharge: number;
  totalAmount: number;
  billingTitle: string;
  billingFirstName: string;
  billingLastName: string;
  billingMobile: string;
  billingAddress: string;
  email: string;
  gstin: string;
  paymentMode: string;
  advanceAmount: number;
  advanceRemarks: string;
  sameAsCustomer: boolean;
  primaryTitle: string;
  primaryFirstName: string;
  primaryLastName: string;
  primaryMobile: string;
  nationality: string;
}

@Component({
  selector: 'app-booking-engine',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomAlertComponent],  // ← alert component imported
  templateUrl: './booking-engine.component.html',
  styleUrls: ['./booking-engine.component.scss']
})
export class BookingEngineComponent implements OnInit {

  roomNoOptions: any[] = [];
  // ── Loader state ──────────────────────────────────────────────────────────
  isLoading = false;
  roomTypesList: any[] = [];

  // ── Dropdown data ─────────────────────────────────────────────────────────
  bookingTypes = [
    'Book Online',
    'Counter Booking',
    'Local Travel Agent (LTA)',
    'Online Travel Agent (OTA)'
  ];

  bookingReferences = ['Head Back Office', 'Kolkata Back Office'];
  soldByNames = ['Gourab Karmakar', 'Sanjay Kumar Hazra', 'Pinaki Das', 'Rohit Sen'];
  // roomTypes = [
  //   'Family Non View',
  //   'Family View',
  //   'Executive Non View',
  //   'Executive View',
  //   'Family Junction View',
  //   'Premium View'
  // ];

  mealPlanOptions = [
    'Room Only',
    'Room with Breakfast and either Lunch or Dinner',
    'Room with Breakfast and Lunch and Dinner',
    'Room with Breakfast'
  ];

  billingNameTitles = ['Mr.', 'Ms.', 'Mrs.', 'M/s', 'Dr.', 'Prof.'];
  childAgeOptions   = Array.from({ length: 16 }, (_, i) => i);
  //roomNoOptions: string[] = [];

  // roomNumbersByType: Record<string, string[]> = {
  //   'Family Non View':     ['101', '102', '103', '104'],
  //   'Family View':         ['201', '202', '203', '204'],
  //   'Executive Non View':  ['301', '302', '303', '304'],
  //   'Executive View':      ['401', '402', '403', '404'],
  //   'Family Junction View':['501', '502', '503'],
  //   'Premium View':        ['601', '602', '603']
  // };

  mealPlanRates: Record<string, number> = {
    'Room Only': 4500,
    'Room with Breakfast and either Lunch or Dinner': 6500,
    'Room with Breakfast and Lunch and Dinner': 8000,
    'Room with Breakfast': 5500
  };

  mealPlanComplimentary: Record<string, number> = {
    'Room Only': 0,
    'Room with Breakfast and either Lunch or Dinner': 1200,
    'Room with Breakfast and Lunch and Dinner': 1800,
    'Room with Breakfast': 1500
  };

  // ── Form model ──────────────────────────────────────────────────────────
  form: BookingForm = {
    bookingType: 'Book Online',
    bookingReference: 'Head Back Office',
    soldBy: 'Gourab Karmakar',
    arrivalFrom: '',
    customerProfile: '',
    purposeOfVisit: '',
    remarks: '',
    checkIn: '',
    checkOut: '',
    roomTypeId: 0,
    roomNo: '',
    mealPlan: 'Room Only',
    extraChildAge: 0,
    adults: 2,
    children: 0,
    rentPerNight: 4500,
    complimentaryPerNight: 0,
    extraCharge: 0,
    totalAmount: 0,
    billingTitle: 'Mr.',
    billingFirstName: '',
    billingLastName: '',
    billingMobile: '',
    billingAddress: '',
    email: '',
    gstin: '',
    paymentMode: '',
    advanceAmount: 0,
    advanceRemarks: '',
    sameAsCustomer: false,
    primaryTitle: 'Mr.',
    primaryFirstName: '',
    primaryLastName: '',
    primaryMobile: '',
    nationality: 'Indian'
  };

  constructor(
    private readonly router: Router,
    private readonly bookingService: BookingService,
    private roomTypeService: RoomTypeService,
    private roomService: RoomService,
    private readonly alertService: CustomAlertService
  ) {
    this.updateRoomOptions();
    this.updateCharges();
  }
ngOnInit(): void {
    this.loadRoomTypes();

};
  onRoomTypeChange(event: any): void {

  const roomTypeId = Number(event.target.value);

  if (roomTypeId) {
    this.loadRoomNumbers(roomTypeId);
  } else {
    this.roomNoOptions = [];
    this.form.roomNo = '';
  }
}


  loadRoomNumbers(roomTypeId: number): void {

  this.roomService.getRoomsByRoomType(roomTypeId).subscribe({

    next: (res: any[]) => {

      this.roomNoOptions = res;

      console.log('Room Numbers:', this.roomNoOptions);

    },

    error: (err) => {

      console.error(err);

      this.roomNoOptions = [];

    }

  });

}

  loadRoomTypes(): void {
  this.roomTypeService.getAll().subscribe({
    next: (res: any) => {
      console.log('Room Types API Response:', res);

      if (Array.isArray(res)) {
        this.roomTypesList = res;
      } else if (res && Array.isArray(res.data)) {
        this.roomTypesList = res.data; // Matches your console log: res.data holds the array
      } else if (res && Array.isArray(res.items)) {
        this.roomTypesList = res.items;
      } else if (res && res.$values) {
        this.roomTypesList = res.$values;
      } else {
        this.roomTypesList = [];
      }
    },
    error: (err) => {
      console.error('Failed to load room types:', err);
    }
  });
}

  // ── Save ──────────────────────────────────────────────────────────────────
  saveBooking(): void {
    // Step 1: Run all validations first — stop if any fail
    if (!this.validateForm()) return;

    // Step 2: Recalculate charges before submission
    this.updateCharges();

    // Step 3: Build clean payload
    const payload = {
      ...this.form,
      extraChildAge:         Number(this.form.extraChildAge)         || 0,
      adults:                Number(this.form.adults)                || 1,
      children:              Number(this.form.children)              || 0,
      rentPerNight:          Number(this.form.rentPerNight)          || 0,
      complimentaryPerNight: Number(this.form.complimentaryPerNight) || 0,
      extraCharge:           Number(this.form.extraCharge)           || 0,
      totalAmount:           Number(this.form.totalAmount)           || 0,
      advanceAmount:         Number(this.form.advanceAmount)         || 0,
      checkIn:  new Date(this.form.checkIn).toISOString(),
      checkOut: new Date(this.form.checkOut).toISOString()
    };

    console.log('Submitting payload:', payload);

    // Step 4: Show loader, call API
    this.isLoading = true;

    this.bookingService.createReservation(payload).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Show success modal; redirect ONLY after user clicks OK
        this.alertService.success(
          `Booking saved successfully!\n\n` +
          `Reservation ID : ${response.bookingId}\n` +
          `Guest ID       : ${response.guestId}\n` +
          `Invoice ID     : ${response.invoiceId}`,
          () => this.router.navigate(['/booking-list'])  // ← onClose callback
        );
      },
      error: (err) => {
        this.isLoading = false;

        const detail =
          err?.error?.message ??
          err?.message         ??
          'Unknown network error';

        this.alertService.error(
          `Failed to save booking.\n\n${detail}\n\nCheck F12 console for details.`
        );

        console.error('Booking API error:', err);
      }
    });
  }

  // ── Validation ────────────────────────────────────────────────────────────
  validateForm(): boolean {
    const rules: Array<[boolean, string]> = [
      [!this.form.checkIn,
        'Check-In Date cannot be blank.'],
      [!this.form.checkOut,
        'Check-Out Date cannot be blank.'],
      [new Date(this.form.checkOut) <= new Date(this.form.checkIn),
        'Check-Out must be after Check-In.'],
      [!this.form.roomNo?.trim(),
        'Please select a Room Number.'],
        [this.form.roomTypeId <= 0,
 'Please select a Room Type.'],
      [!this.form.billingFirstName?.trim(),
        'Billing First Name cannot be blank.'],
      [!this.form.billingLastName?.trim(),
        'Billing Last Name cannot be blank.'],
      [!this.form.billingMobile?.trim(),
        'Billing Mobile Number cannot be blank.'],
      [!this.form.billingAddress?.trim(),
        'Billing Address cannot be blank.'],
      [!this.form.email?.trim(),
        'Email cannot be blank.'],
      [!this.form.paymentMode?.trim(),
        'Please select a Payment Mode.'],
      [this.form.advanceAmount > 0 && !this.form.advanceRemarks?.trim(),
        'Please provide remarks for the advance payment.'],
      [!this.form.primaryFirstName?.trim(),
        'Primary Guest First Name cannot be blank.'],
      [!this.form.primaryLastName?.trim(),
        'Primary Guest Last Name cannot be blank.'],
      [!this.form.primaryMobile?.trim(),
        'Primary Guest Mobile Number cannot be blank.'],
    ];

    for (const [condition, message] of rules) {
      if (condition) {
        this.alertService.error(`Validation Error\n\n${message}`);
        return false;
      }
    }
    return true;
  }

  // ── Room & Charge Helpers ─────────────────────────────────────────────────
  // updateRoomOptions(): void {
  //   this.roomNoOptions = this.roomNumbersByType[this.form.roomType] ?? [];
  //   if (!this.roomNoOptions.includes(this.form.roomNo)) {
  //     this.form.roomNo = '';
  //   }
  // }

updateRoomOptions(): void {

  const selectedRoomType = this.roomTypesList.find(
    x => x.id === this.form.roomTypeId
  );

  console.log('Selected Room Type:', selectedRoomType);

  // Temporary dummy room numbers
  // Later load from Room API

  this.roomNoOptions = [
    '101',
    '102',
    '103',
    '201',
    '202'
  ];

  if (!this.roomNoOptions.includes(this.form.roomNo)) {
    this.form.roomNo = '';
  }
}
  updateCharges(): void {
    this.form.rentPerNight          = this.mealPlanRates[this.form.mealPlan]         ?? 0;
    this.form.complimentaryPerNight = this.mealPlanComplimentary[this.form.mealPlan] ?? 0;

    const nights      = this.calculateNights();
    const roomCharge  = this.form.rentPerNight * Math.max(1, nights);
    const extraChild  = (this.form.extraChildAge >= 7 &&
                         this.form.mealPlan.includes('Breakfast')) ? 300 : 0;

    this.form.extraCharge  = extraChild;
    this.form.totalAmount  = roomCharge + extraChild;
  }

  calculateNights(): number {
    if (!this.form.checkIn || !this.form.checkOut) return 1;
    const diff = new Date(this.form.checkOut).getTime() -
                 new Date(this.form.checkIn).getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
  }

  // onRoomTypeChange():     void { this.updateRoomOptions(); }
//   onRoomTypeChange(): void {

//   const selectedRoom = this.roomTypesList.find(
//     x => x.id === this.form.roomTypeId
//   );

//   console.log('Selected Room Type:', selectedRoom);

//   // TODO:
//   // Later load available rooms from API

//   this.roomNoOptions = [];

//   this.form.roomNo = '';
// }
  onMealPlanChange():     void { this.updateCharges(); }
  onChildAgeChange():     void { this.updateCharges(); }
  recalculate():          void { this.updateCharges(); }

  onSameAsCustomerChange(): void {
    if (this.form.sameAsCustomer) {
      this.form.primaryTitle     = this.form.billingTitle;
      this.form.primaryFirstName = this.form.billingFirstName;
      this.form.primaryLastName  = this.form.billingLastName;
      this.form.primaryMobile    = this.form.billingMobile;
    }
  }

  cancel(): void {
    this.router.navigate(['/booking-list']);
  }
}