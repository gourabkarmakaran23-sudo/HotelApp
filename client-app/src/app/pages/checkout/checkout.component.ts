import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  bookingNumber = '';
  guestName = '';
  roomNos = '';

  // sample billing data
  billing = {
    roomRent: '₹12,240.00',
    amenity: '₹0.00',
    cancellation: '₹0.00',
    refund: '₹0.00',
    totalTax: '₹612.00',
    subtotal: '₹12,852.00',
    dueTransferFrom: '00002706'
  };

  roomBills = [
    { no: 1, roomNo: '201', roomType: 'Executive View', from: '07-05-2026 12:18', to: '08-05-2026 10:00', nights: 1, rent: '₹6120.00' },
    { no: 2, roomNo: '304', roomType: 'Executive View', from: '07-05-2026 12:18', to: '08-05-2026 10:00', nights: 1, rent: '₹6120.00' }
  ];

  balance = { remaining: '₹33,827.00', collected: '₹0.00', change: '₹0.00' };

  additionalCharges = 0;
  adjustmentAmount = 0;
  subtotalNumber = 0;

  constructor(private readonly router: Router, private readonly http: HttpClient) {}

  ngOnInit(): void {
    // prefer router state, fallback to history.state for direct navigation
    const nav = this.router.getCurrentNavigation()?.extras.state as any;
    const st = nav ?? (history.state ?? {});
    if (st && st.row) {
      this.bookingNumber = st.row.bookingNumber ?? this.bookingNumber;
      this.guestName = st.row.name ?? this.guestName;
      this.roomNos = st.row.roomNo ?? this.roomNos;
    }

    // compute numeric subtotal from roomBills
    this.computeTotals();
  }

  

  computeTotals(): void {
    const sum = this.roomBills.reduce((acc, b) => {
      // rent is like '₹6120.00'
      const n = Number(String(b.rent).replace(/[₹,\s]/g, '').replace(/,/g, '')) || 0;
      return acc + n;
    }, 0);
    this.subtotalNumber = sum;
  }

  back(): void {
    this.router.navigateByUrl('/checkin');
  }

  doCheckout(): void {
    const payload = {
      bookingNumber: this.bookingNumber,
      guestName: this.guestName,
      roomNos: this.roomNos,
      additionalCharges: this.additionalCharges,
      adjustmentAmount: this.adjustmentAmount,
      subtotal: this.subtotalNumber
    };

    // attempt to POST to backend; if backend missing, handle error and show success stub
    this.http.post('/api/checkout', payload).subscribe({
      next: () => alert('Checkout completed (server)') ,
      error: () => alert('Checkout completed (stub)')
    });
  }
}
