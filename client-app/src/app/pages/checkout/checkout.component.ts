import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { apiBaseUrl } from '../../app.config';
import { CustomAlertService } from '../../services/custom-alert.service';
import { MasterService } from '../../services/master.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  bookingId: number | null = null;
  bookingNumber = '';
  guestName = '';
  roomNos = '';
  paymentMethods: any[] = [];
  selectedPaymentMode = '';

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

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly masterService: MasterService,
    private readonly alertService: CustomAlertService
  ) {}

  ngOnInit(): void {
    this.loadPaymentMethods();

    // prefer router state, fallback to history.state for direct navigation
    const nav = this.router.getCurrentNavigation()?.extras.state as any;
    const st = nav ?? (history.state ?? {});
    if (st && st.row) {
      this.bookingId = st.row.bookingId ?? st.row.id ?? this.bookingId;
      this.bookingNumber = st.row.bookingNumber ?? this.bookingNumber;
      this.guestName = st.row.name ?? this.guestName;
      this.roomNos = st.row.roomNo ?? this.roomNos;
    }

    // compute numeric subtotal from roomBills
    this.computeTotals();
  }

  loadPaymentMethods(): void {
    this.masterService.getPaymentMethods().subscribe({
      next: (res) => {
        this.paymentMethods = res || [];
        if (!this.selectedPaymentMode && this.paymentMethods.length > 0) {
          this.selectedPaymentMode = this.paymentMethods[0].methodName || this.paymentMethods[0].name || this.paymentMethods[0].paymentMode || '';
        }
      },
      error: (err) => {
        console.error('Failed to load payment methods:', err);
      }
    });
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

  generateProforma(): void {
    const notice = `Room Rent Proforma\nBooking: ${this.bookingNumber}\nGuest: ${this.guestName}`;

    const html = `
      <html>
        <head>
          <title>Room Rent Proforma</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
            h1, h2, h3, h4, h5, h6 { margin: 0; }
            .header { margin-bottom: 24px; }
            .header h1 { font-size: 24px; }
            .header .meta { margin-top: 8px; font-size: 14px; color: #444; }
            .section { margin-bottom: 20px; }
            .section-title { margin-bottom: 10px; font-size: 16px; font-weight: 700; color: #222; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
            .detail-row span:first-child { font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
            th { background: #f3f3f3; font-weight: 700; }
            .summary { width: 320px; float: right; margin-top: 16px; }
            .summary .summary-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .summary .summary-row span:first-child { font-weight: 700; }
            .footer { margin-top: 32px; font-size: 12px; color: #555; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Room Rent Proforma</h1>
            <div class="meta">Generated on ${new Date().toLocaleString()}</div>
          </div>

          <div class="section">
            <div class="section-title">Guest & Booking Details</div>
            <div class="detail-row"><span>Booking No:</span><span>${this.bookingNumber || 'N/A'}</span></div>
            <div class="detail-row"><span>Guest Name:</span><span>${this.guestName || 'N/A'}</span></div>
            <div class="detail-row"><span>Room Nos:</span><span>${this.roomNos || 'N/A'}</span></div>
            <div class="detail-row"><span>Payment Mode:</span><span>${this.selectedPaymentMode || 'N/A'}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Room Rent Details</div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Room No</th>
                  <th>Room Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>NoD</th>
                  <th>Total Rent</th>
                </tr>
              </thead>
              <tbody>
                ${this.roomBills.map(b => `
                  <tr>
                    <td>${b.no}</td>
                    <td>${b.roomNo}</td>
                    <td>${b.roomType}</td>
                    <td>${b.from}</td>
                    <td>${b.to}</td>
                    <td>${b.nights}</td>
                    <td>${b.rent}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="summary">
            <div class="summary-row"><span>Room Rent:</span><span>${this.billing.roomRent}</span></div>
            <div class="summary-row"><span>Amenities:</span><span>${this.billing.amenity}</span></div>
            <div class="summary-row"><span>Cancellation:</span><span>${this.billing.cancellation}</span></div>
            <div class="summary-row"><span>Refund:</span><span>${this.billing.refund}</span></div>
            <div class="summary-row"><span>Total Tax:</span><span>${this.billing.totalTax}</span></div>
            <div class="summary-row" style="font-size: 15px; font-weight: 700;"><span>Subtotal:</span><span>${this.billing.subtotal}</span></div>
          </div>

          <div class="footer">
            ${notice}
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Unable to open proforma preview window. Please allow popups for this site.');
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  doCheckout(): void {
    const payload = {
      bookingNumber: this.bookingNumber,
      guestName: this.guestName,
      roomNos: this.roomNos,
      paymentMode: this.selectedPaymentMode,
      additionalCharges: this.additionalCharges,
      adjustmentAmount: this.adjustmentAmount,
      subtotal: this.subtotalNumber
    };

    if (!this.bookingId) {
      this.alertService.error('Unable to complete checkout: booking information is missing.');
      return;
    }

    this.http.post(`${apiBaseUrl}/bookings/${this.bookingId}/checkout`, payload).subscribe({
      next: () => {
        this.alertService.success('Checkout completed successfully.', () => {
          this.router.navigateByUrl('/checkin');
        });
      },
      error: (err) => {
        console.error('Checkout failed:', err);
        this.alertService.error('Checkout failed. Please try again.');
      }
    });
  }
}
