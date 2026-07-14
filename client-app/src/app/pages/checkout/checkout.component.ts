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
  paymentAmount = 0;
  remainingDue = 33827;

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

  balance = {
    remaining: this.remainingDue,
    collected: 0,
    change: 0
  };

  roomBills = [
    { no: 1, roomNo: '201', roomType: 'Executive View', from: '07-05-2026 12:18', to: '08-05-2026 10:00', nights: 1, rent: '₹6120.00' },
    { no: 2, roomNo: '304', roomType: 'Executive View', from: '07-05-2026 12:18', to: '08-05-2026 10:00', nights: 1, rent: '₹6120.00' }
  ];

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
    this.updateBalance();
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

  updateBalance(): void {
    const payment = Number(this.paymentAmount);
    const safePayment = Number.isFinite(payment) ? payment : 0;
    const remaining = Math.max(this.remainingDue - safePayment, 0);
    const change = Math.max(safePayment - this.remainingDue, 0);

    this.balance.collected = safePayment;
    this.balance.change = change;
    this.balance.remaining = remaining;
    this.paymentAmount = safePayment;
  }

  onPaymentInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsNumber;
    this.paymentAmount = Number.isFinite(value) ? value : 0;
    this.updateBalance();
  }

  get amountShortfall(): number {
    const payment = Number(this.paymentAmount);
    return Number.isFinite(payment) ? Math.max(this.remainingDue - payment, 0) : this.remainingDue;
  }

  get amountMessage(): string {
    if (!this.selectedPaymentMode) {
      return 'Please select a payment mode first.';
    }

    const payment = Number(this.paymentAmount);
    if (!Number.isFinite(payment) || payment <= 0) {
      return 'Please enter the full settlement amount.';
    }

    if (payment < this.remainingDue) {
      return `Collect ${this.formatCurrency(this.amountShortfall)} more to complete settlement.`;
    }

    return 'Full settlement entered. You may complete checkout.';
  }

  get validationClass(): string {
    const payment = Number(this.paymentAmount);
    if (!this.selectedPaymentMode || !Number.isFinite(payment) || payment <= 0 || payment < this.remainingDue) {
      return 'validation-message error';
    }
    return 'validation-message success';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value).replace('₹', '₹');
  }

  get canCheckout(): boolean {
    const payment = Number(this.paymentAmount);
    return (
      this.selectedPaymentMode !== '' &&
      Number.isFinite(payment) &&
      payment >= this.remainingDue &&
      this.remainingDue > 0
    );
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
    if (!this.canCheckout) {
      const payment = Number(this.paymentAmount);
      if (!Number.isFinite(payment) || payment <= 0) {
        this.alertService.error('Please enter a valid payment amount before checkout.');
      } else if (payment < this.remainingDue) {
        this.alertService.error('Checkout requires full payment settlement. Please collect the remaining amount first.');
      } else if (!this.selectedPaymentMode) {
        this.alertService.error('Please select a payment mode before completing checkout.');
      } else {
        this.alertService.error('Checkout cannot proceed. Please verify the payment details.');
      }
      return;
    }

    if (!this.bookingId) {
      this.alertService.error('Unable to complete checkout: booking information is missing.');
      return;
    }

    if (!this.selectedPaymentMode) {
      this.alertService.error('Please select a payment mode before completing checkout.');
      return;
    }

    const payment = Number(this.paymentAmount);

    const payload = {
      bookingNumber: this.bookingNumber,
      guestName: this.guestName,
      roomNos: this.roomNos,
      paymentMode: this.selectedPaymentMode,
      amountPaid: payment,
      additionalCharges: this.additionalCharges,
      adjustmentAmount: this.adjustmentAmount,
      subtotal: this.subtotalNumber,
      changeAmount: this.balance.change
    };

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
