import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { CustomAlertService } from '../../services/custom-alert.service';
import { CustomAlertComponent } from '../shared/custom-alert/custom-alert.component';
import { RoomTypeService } from '../../services/room-type.service';
import { RoomService } from '../../services/room.service';
import { BookingRoom } from '../../models/booking.models';
import { BookingForm } from '../../models/booking.models';

// interface BookingForm {
//   bookingType: string;
//   bookingReference: string;
//   soldBy: string;
//   arrivalFrom: string;
//   customerProfile: string;
//   purposeOfVisit: string;
//   remarks: string;
//   checkIn: string;
//   checkOut: string;
//   roomTypeId: number; // Matches foreign key to RoomTypes entity
//   roomType?: any;     // Optional navigation object if included
//   roomNo: string;
//   mealPlan: string;
//   extraChildAge: number;
//   adults: number;
//   children: number;
//   rentPerNight: number;
//   complimentaryPerNight: number;
//   extraCharge: number;
//   totalAmount: number;
//   billingTitle: string;
//   billingFirstName: string;
//   billingLastName: string;
//   billingMobile: string;
//   billingAddress: string;
//   email: string;
//   gstin: string;
//   paymentMode: string;
//   advanceAmount: number;
//   advanceRemarks: string;
//   sameAsCustomer: boolean;
//   primaryTitle: string;
//   primaryFirstName: string;
//   primaryLastName: string;
//   primaryMobile: string;
//   nationality: string;
// }

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

  isEditMode = false;
  bookingId = 0;

  mode = 'create';
  selectedBooking: any = null;

  showViewModal = false;
  // ── Dropdown data ─────────────────────────────────────────────────────────
  bookingTypes = [
    'Book Online',
    'Counter Booking',
    'Local Travel Agent (LTA)',
    'Online Travel Agent (OTA)'
  ];

  bookingReferences = ['Head Back Office', 'Kolkata Back Office'];
  soldByNames = ['Gourab Karmakar', 'Sanjay Kumar Hazra', 'Pinaki Das', 'Rohit Sen'];

  mealPlanOptions = [
    'Room Only',
    'Room with Breakfast and either Lunch or Dinner',
    'Room with Breakfast and Lunch and Dinner',
    'Room with Breakfast'
  ];

  billingNameTitles = ['Mr.', 'Ms.', 'Mrs.', 'M/s', 'Dr.', 'Prof.'];
  childAgeOptions = Array.from({ length: 16 }, (_, i) => i);

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

    customerProfile: 'Google',

    purposeOfVisit: '',

    remarks: '',

    checkIn: '',

    checkOut: '',

    rooms: [

      {

        roomTypeId: 0,

        roomType: null,

        roomNo: '',

        mealPlan: 'Room Only',

        extraChildAge: 0,

        adults: 2,

        children: 0,

        rentPerNight: 4500,

        complimentaryPerNight: 0,

        extraCharge: 0,

        totalAmount: 0,

        roomNoOptions: []
      }

    ],

    totalAmount: 0,

    billingTitle: 'Mr',

    billingFirstName: '',

    billingLastName: '',

    billingMobile: '',

    billingAddress: '',

    email: '',

    gstin: '',

    paymentMode: 'Cash',

    advanceAmount: 0,

    advanceRemarks: '',

    sameAsCustomer: true,

    primaryTitle: 'Mr',

    primaryFirstName: '',

    primaryLastName: '',

    primaryMobile: '',

    nationality: 'Indian'
  };
  constructor(
    private readonly router: Router,
    private route: ActivatedRoute,
    private readonly bookingService: BookingService,
    private roomTypeService: RoomTypeService,
    private roomService: RoomService,
    private readonly alertService: CustomAlertService
  ) {

    this.updateCharges(0);
    this.calculateGrandTotal();
  }
  ngOnInit(): void {
    this.loadRoomTypes();
   
    // const id = this.route.snapshot.paramMap.get('id');

    // if (id) {

    //   this.isEditMode = true;

    //   this.bookingId = Number(id);

    //   this.loadBookingForEdit(this.bookingId);

    // }
     this.route.queryParams.subscribe(params => {

    const id = params['id'];

    const mode = params['mode'];

    if (id && mode === 'edit') {

      this.loadBookingForEdit(id);
    }
  });

  };
  closeModal(): void {

    this.showViewModal = false;

  }
  editBooking(id: number): void {

    this.router.navigate(['/booking-engine', id]);

  }
  viewBooking(row: any): void {

    this.bookingService
      .getBookingForEdit(row.id)
      .subscribe({

        next: (data) => {

          this.selectedBooking = data;

          this.showViewModal = true;

        }

      });

  }
 loadBookingForEdit(id: number): void {

  this.bookingService
    .getBookingById(id)
    .subscribe({

      next: (res) => {

        console.log('EDIT DATA:', res);

        this.form.bookingType =
          res.bookingType;

        this.form.bookingReference =
          res.bookingReference;

        this.form.soldBy =
          res.soldBy;

        this.form.arrivalFrom =
          res.arrivalFrom;

        this.form.customerProfile =
          res.customerProfile;

        this.form.purposeOfVisit =
          res.purposeOfVisit;

        this.form.remarks =
          res.remarks;

        this.form.checkIn =
          res.checkInDate;

        this.form.checkOut =
          res.checkOutDate;

        this.form.billingFirstName =
          res.billingFirstName;

        this.form.billingLastName =
          res.billingLastName;

        this.form.billingMobile =
          res.billingMobile;

        this.form.email =
          res.email;

        this.form.rooms =
          res.rooms;
      },

      error: (err) => {

        console.error(err);

        this.alertService.error(
          'Failed to load booking.'
        );
      }
    });
}

  formatDateForInput(date: string): string {

    const d = new Date(date);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  }
  addRoom(): void {

    this.form.rooms.push({

      roomTypeId: 0,

      roomType: null,

      roomNo: '',

      mealPlan: 'Room Only',

      extraChildAge: 0,

      adults: 2,

      children: 0,

      rentPerNight: 0,

      complimentaryPerNight: 0,

      extraCharge: 0,

      totalAmount: 0,

      roomNoOptions: []
    });
  }

  removeRoom(index: number): void {

    this.form.rooms.splice(index, 1);

    this.calculateGrandTotal();
  }
  onRoomTypeChange(index: number): void {

    const room = this.form.rooms[index];

    if (!room.roomTypeId) {

      room.roomNoOptions = [];

      room.roomNo = '';

      return;
    }

    this.roomService
      .getRoomsByRoomType(room.roomTypeId)
      .subscribe({

        next: (rooms: any[]) => {

          room.roomNoOptions = rooms;

          room.roomNo = '';
        },

        error: () => {

          room.roomNoOptions = [];

        }
      });
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
    this.updateCharges(0);

    // Step 3: Build clean payload
    const payload = {

      bookingType: this.form.bookingType,

      bookingReference: this.form.bookingReference,

      soldBy: this.form.soldBy,

      arrivalFrom: this.form.arrivalFrom,

      customerProfile: this.form.customerProfile,

      purposeOfVisit: this.form.purposeOfVisit,

      remarks: this.form.remarks,

      checkIn: new Date(this.form.checkIn).toISOString(),

      checkOut: new Date(this.form.checkOut).toISOString(),

      totalAmount: Number(this.form.totalAmount) || 0,

      billingTitle: this.form.billingTitle,

      billingFirstName: this.form.billingFirstName,

      billingLastName: this.form.billingLastName,

      billingMobile: this.form.billingMobile,

      billingAddress: this.form.billingAddress,

      email: this.form.email,

      gstin: this.form.gstin,

      paymentMode: this.form.paymentMode,

      advanceAmount: Number(this.form.advanceAmount) || 0,

      advanceRemarks: this.form.advanceRemarks,

      sameAsCustomer: this.form.sameAsCustomer,

      primaryTitle: this.form.primaryTitle,

      primaryFirstName: this.form.primaryFirstName,

      primaryLastName: this.form.primaryLastName,

      primaryMobile: this.form.primaryMobile,

      nationality: this.form.nationality,

      rooms: this.form.rooms.map(room => ({

        roomTypeId: Number(room.roomTypeId),

        roomNo: room.roomNo,

        mealPlan: room.mealPlan,

        extraChildAge: Number(room.extraChildAge) || 0,

        adults: Number(room.adults) || 1,

        children: Number(room.children) || 0,

        rentPerNight: Number(room.rentPerNight) || 0,

        complimentaryPerNight:
          Number(room.complimentaryPerNight) || 0,

        extraCharge:
          Number(room.extraCharge) || 0,

        totalAmount:
          Number(room.totalAmount) || 0
      }))
    };

    console.log('Submitting payload:', payload);

    // Step 4: Show loader, call API
    this.isLoading = true;

    this.bookingService.createReservation(payload).subscribe({
      next: (response) => {
        this.isLoading = false;

        // Show success modal; redirect ONLY after user clicks OK
        // this.alertService.success(
        //   `Booking saved successfully!\n\n` +
        //   `Reservation ID : ${response.bookingId}\n` +
        //   `Guest ID       : ${response.guestId}\n` +
        //   `Invoice ID     : ${response.invoiceId}`,
        //   () => this.router.navigate(['/booking-list'])  // ← onClose callback
        // );

        this.alertService.success('Booking Saved Successfully');

        setTimeout(() => {

          this.router.navigate(['/booking-list']);

        }, 1000);
      },
      error: (err) => {

        this.isLoading = false;

        console.log('BOOKING ERROR:', err);

        // Backend custom validation message
        let errorMessage = 'Failed to save booking.';

        if (err.error?.message) {

          errorMessage = err.error.message;

        }
        else if (err.error?.errors?.length > 0) {

          errorMessage = err.error.errors[0];

        }
        else if (typeof err.error === 'string') {

          errorMessage = err.error;

        }

        this.alertService.error(errorMessage);

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
      // [!this.form.roomNo?.trim(),
      //   'Please select a Room Number.'],
      // [this.form.roomTypeId <= 0,
      //   'Please select a Room Type.'],
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
    for (const room of this.form.rooms) {

      if (room.roomTypeId <= 0) {

        this.alertService.error(
          'Please select a Room Type.'
        );

        return false;
      }

      if (!room.roomNo?.trim()) {

        this.alertService.error(
          'Please select a Room Number.'
        );

        return false;
      }
    }

    for (const [condition, message] of rules) {
      if (condition) {
        this.alertService.error(`Validation Error\n\n${message}`);
        return false;
      }
    }
    return true;
  }

  // ── Room & Charge Helpers ─────────────────────────────────────────────────



  updateCharges(index: number): void {

    const room = this.form.rooms[index];

    room.rentPerNight =
      this.mealPlanRates[room.mealPlan] ?? 0;

    room.complimentaryPerNight =
      this.mealPlanComplimentary[room.mealPlan] ?? 0;

    const nights = this.calculateNights();

    const roomCharge =
      room.rentPerNight * Math.max(1, nights);

    const extraChild =
      (
        room.extraChildAge >= 7
        &&
        room.mealPlan.includes('Breakfast')
      )
        ? 300
        : 0;

    room.extraCharge = extraChild;

    room.totalAmount =
      roomCharge + extraChild;

    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {

    this.form.totalAmount =
      this.form.rooms.reduce(
        (sum, room) =>
          sum + (Number(room.totalAmount) || 0),
        0
      );
  }
  calculateNights(): number {
    if (!this.form.checkIn || !this.form.checkOut) return 1;
    const diff = new Date(this.form.checkOut).getTime() -
      new Date(this.form.checkIn).getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
  }



  onMealPlanChange(index: number): void {

    this.updateCharges(index);
    this.calculateGrandTotal();
  }
  onChildAgeChange(index: number): void {

    this.updateCharges(index);
    this.calculateGrandTotal();
  }
  recalculate(index: number): void {

    this.updateCharges(index);
    this.calculateGrandTotal();
  }
  recalculateAllRooms(): void {

    this.form.rooms.forEach((_, index) => {

      this.updateCharges(index);

    });

    this.calculateGrandTotal();
  }

  onSameAsCustomerChange(): void {
    if (this.form.sameAsCustomer) {
      this.form.primaryTitle = this.form.billingTitle;
      this.form.primaryFirstName = this.form.billingFirstName;
      this.form.primaryLastName = this.form.billingLastName;
      this.form.primaryMobile = this.form.billingMobile;
    }
  }

  cancel(): void {
    this.router.navigate(['/booking-list']);
  }
}