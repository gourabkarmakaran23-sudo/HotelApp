export interface BookingRoom {

  roomTypeId: number;

  roomType?: any;

  roomNo: string;

  mealPlan: string;

  extraChildAge: number;

  adults: number;

  children: number;

  rentPerNight: number;

  complimentaryPerNight: number;

  extraCharge: number;

  totalAmount: number;

  roomNoOptions: any[];
}

export interface BookingForm {
 
  // =========================
  // BOOKING DETAILS
  // =========================

  bookingType: string;

  bookingReference: string;

  soldBy: string;

  arrivalFrom: string;

  customerProfile: string;

  purposeOfVisit: string;

  remarks: string;

  checkIn: string;

  checkOut: string;

  // =========================
  // MULTI ROOM SUPPORT
  // =========================

  rooms: BookingRoom[];

  // =========================
  // BOOKING TOTAL
  // =========================

  totalAmount: number;

  // =========================
  // BILLING DETAILS
  // =========================

  billingTitle: string;

  billingFirstName: string;

  billingLastName: string;

  billingMobile: string;

  billingAddress: string;

  email: string;

  gstin: string;

  // =========================
  // PAYMENT
  // =========================

  paymentMode: string;

  advanceAmount: number;

  advanceRemarks: string;

  // =========================
  // PRIMARY GUEST
  // =========================

  sameAsCustomer: boolean;

  primaryTitle: string;

  primaryFirstName: string;

  primaryLastName: string;

  primaryMobile: string;

  nationality: string;
}