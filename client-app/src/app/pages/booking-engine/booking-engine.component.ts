import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  roomType: string;
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
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-engine.component.html',
  styleUrls: ['./booking-engine.component.scss']
})
export class BookingEngineComponent {
  bookingTypes = [
    'Book Online',
    'Counter Booking',
    'Local Travel Agent (LTA)',
    'Online Travel Agent (OTA)'
  ];

  bookingReferences = ['Head Back Office', 'Kolkata Back Office'];
  soldByNames = ['Gourab Karmakar', 'Sanjay Kumar Hazra', 'Pinaki Das', 'Rohit Sen'];
  roomTypes = [
    'Family Non View',
    'Family View',
    'Executive Non View',
    'Executive View',
    'Family Junction View',
    'Premium View'
  ];

  mealPlanOptions = [
    'Room Only',
    'Room with Breakfast and either Lunch or Dinner',
    'Room with Breakfast and Lunch and Dinner',
    'Room with Breakfast'
  ];

  billingNameTitles = ['Mr.', 'Ms.', 'Mrs.', 'M/s', 'Dr.', 'Prof.'];

  roomNumbersByType: Record<string, string[]> = {
    'Family Non View': ['101', '102', '103', '104'],
    'Family View': ['201', '202', '203', '204'],
    'Executive Non View': ['301', '302', '303', '304'],
    'Executive View': ['401', '402', '403', '404'],
    'Family Junction View': ['501', '502', '503'],
    'Premium View': ['601', '602', '603']
  };

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
    roomType: 'Family Non View',
    roomNo: '',
    mealPlan: 'Room Only',
    extraChildAge: 0,
    adults: 2,
    children: 0,
    rentPerNight: this.mealPlanRates['Room Only'],
    complimentaryPerNight: this.mealPlanComplimentary['Room Only'],
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

  roomNoOptions: string[] = [];
  childAgeOptions = Array.from({ length: 16 }, (_, i) => i);

  constructor(private readonly router: Router) {
    this.updateRoomOptions();
    this.updateCharges();
  }

  updateRoomOptions(): void {
    this.roomNoOptions = this.roomNumbersByType[this.form.roomType] ?? [];
    if (!this.roomNoOptions.includes(this.form.roomNo)) {
      this.form.roomNo = '';
    }
  }

  updateCharges(): void {
    this.form.rentPerNight = this.mealPlanRates[this.form.mealPlan] ?? 0;
    this.form.complimentaryPerNight = this.mealPlanComplimentary[this.form.mealPlan] ?? 0;

    const nights = this.calculateNights();
    const roomCharge = this.form.rentPerNight * Math.max(1, nights);

    const extraChildCharge =
      this.form.extraChildAge >= 7 && this.form.mealPlan.includes('Breakfast')
        ? 300
        : 0;

    this.form.extraCharge = extraChildCharge;
    this.form.totalAmount = roomCharge + extraChildCharge;
  }

  calculateNights(): number {
    if (!this.form.checkIn || !this.form.checkOut) {
      return 1;
    }

    const checkInDate = new Date(this.form.checkIn);
    const checkOutDate = new Date(this.form.checkOut);
    const diff = checkOutDate.getTime() - checkInDate.getTime();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 1;
  }

  onRoomTypeChange(): void {
    this.updateRoomOptions();
  }

  onMealPlanChange(): void {
    this.updateCharges();
  }

  onChildAgeChange(): void {
    this.updateCharges();
  }

  onSameAsCustomerChange(): void {
    if (this.form.sameAsCustomer) {
      this.form.primaryTitle = this.form.billingTitle;
      this.form.primaryFirstName = this.form.billingFirstName;
      this.form.primaryLastName = this.form.billingLastName;
      this.form.primaryMobile = this.form.billingMobile;
    }
  }

  recalculate(): void {
    this.updateCharges();
  }

  saveBooking(): void {
    this.updateCharges();
    alert(`Booking saved. Total amount: ₹${this.form.totalAmount.toLocaleString('en-IN')}`);
  }

  cancel(): void {
    this.router.navigate(['/booking-list']);
  }
}
