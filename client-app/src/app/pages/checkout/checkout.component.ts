import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  directCheckoutMode = false;
  paymentMethods: any[] = [];
  selectedPaymentMode = '';
  paymentEntries: Array<{ paymentMode: string; amount: number; note: string }> = [
    { paymentMode: '', amount: 0, note: '' }
  ];
  remainingDue = 0;

  billing = {
    roomRent: '₹0.00',
    advance: '₹0.00',
    due: '₹0.00',
    amenity: '₹0.00',
    cancellation: '₹0.00',
    refund: '₹0.00',
    totalTax: '₹0.00',
    subtotal: '₹0.00',
    dueTransferFrom: ''
  };

  balance = {
    remaining: this.remainingDue,
    collected: 0,
    change: 0
  };

  roomBills: Array<{ no: number; roomNo: string; roomType: string; from: string; to: string; nights: number; rent: string }> = [];

  additionalCharges = 0;
  adjustmentAmount = 0;
  subtotalNumber = 0;
  loadingBooking = false;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly masterService: MasterService,
    private readonly alertService: CustomAlertService
  ) {}

  ngOnInit(): void {
    this.loadPaymentMethods();

    // prefer router state, fallback to history.state and query params
    const nav = this.router.getCurrentNavigation()?.extras.state as any;
    const st = nav ?? (history.state ?? {});
    if (st && st.row) {
      this.bookingId = st.row.bookingId ?? st.row.id ?? this.bookingId;
      this.bookingNumber = st.row.bookingNumber ?? this.bookingNumber;
      this.guestName = st.row.name ?? this.guestName;
      this.roomNos = st.row.roomNo ?? this.roomNos;
    }

    if (!this.bookingId) {
      const queryId = this.activatedRoute.snapshot.queryParamMap.get('bookingId');
      if (queryId) {
        this.bookingId = Number(queryId) || this.bookingId;
      }
    }

    this.directCheckoutMode = this.router.url.startsWith('/direct-checkout');

    console.log('CheckoutComponent ngOnInit', { bookingId: this.bookingId, bookingNumber: this.bookingNumber, roomNos: this.roomNos, directCheckoutMode: this.directCheckoutMode });

    if (this.bookingId) {
      this.loadBookingDetails(this.bookingId);
    } else {
      this.computeTotals();
      this.updateBalance();
    }
  }

  loadPaymentMethods(): void {
    this.masterService.getPaymentMethods().subscribe({
      next: (res) => {
        this.paymentMethods = res || [];
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

  get paymentTotal(): number {
    return this.paymentEntries.reduce((sum, entry) => {
      const amount = Number(entry.amount);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
  }

  updateBalance(): void {
    const safePayment = this.paymentTotal;
    const remaining = Math.max(this.remainingDue - safePayment, 0);
    const change = Math.max(safePayment - this.remainingDue, 0);

    this.balance.collected = safePayment;
    this.balance.change = change;
    this.balance.remaining = remaining;
  }

  onPaymentEntryChange(index: number): void {
    const entry = this.paymentEntries[index];
    entry.amount = Number.isFinite(Number(entry.amount)) ? Number(entry.amount) : 0;
    this.updateBalance();
  }

  addPaymentEntry(): void {
    this.paymentEntries.push({ paymentMode: '', amount: 0, note: '' });
  }

  removePaymentEntry(index: number): void {
    if (this.paymentEntries.length <= 1) {
      return;
    }
    this.paymentEntries.splice(index, 1);
    this.updateBalance();
  }

  get amountShortfall(): number {
    return Math.max(this.remainingDue - this.paymentTotal, 0);
  }

  get amountMessage(): string {
    if (this.remainingDue <= 0) {
      return 'No remaining balance. Checkout is ready.';
    }

    if (this.paymentTotal <= 0) {
      return 'Please enter at least one payment amount.';
    }

    if (this.paymentTotal < this.remainingDue) {
      return `Collect ${this.formatCurrency(this.amountShortfall)} more to complete settlement.`;
    }

    return 'Full settlement entered. You may complete checkout.';
  }

  get validationClass(): string {
    if (this.remainingDue <= 0) {
      return 'validation-message success';
    }

    if (!Number.isFinite(this.paymentTotal) || this.paymentTotal <= 0 || this.paymentTotal < this.remainingDue) {
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

  formatLocalDateTime(value: string | Date | undefined | null): string {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${mins}`;
  }

  calculateNights(from: string | Date | undefined | null, to: string | Date | undefined | null): number {
    if (!from || !to) return 1;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) return 1;
    const diff = toDate.getTime() - fromDate.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
  }

  get canCheckout(): boolean {
    if (this.remainingDue <= 0) {
      return true;
    }

    const validPayments = this.paymentEntries.filter((entry) => Number.isFinite(Number(entry.amount)) && Number(entry.amount) > 0);
    if (validPayments.length === 0) {
      return false;
    }

    const paymentTotal = this.paymentTotal;
    if (!Number.isFinite(paymentTotal) || paymentTotal < this.remainingDue) {
      return false;
    }

    return validPayments.every((entry) => Boolean(entry.paymentMode));
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
            <div class="detail-row"><span>Payment Mode:</span><span>${this.selectedPaymentMode || this.paymentEntries[0]?.paymentMode || 'N/A'}</span></div>
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
      const validPayments = this.paymentEntries.filter((entry) => Number.isFinite(Number(entry.amount)) && Number(entry.amount) > 0);
      if (validPayments.length === 0) {
        this.alertService.error('Please enter at least one payment amount before checkout.');
      } else if (!validPayments.every((entry) => Boolean(entry.paymentMode))) {
        this.alertService.error('Please select a payment mode for each submitted payment entry.');
      } else if (this.paymentTotal < this.remainingDue) {
        this.alertService.error('Checkout requires full payment settlement. Please collect the remaining amount first.');
      } else {
        this.alertService.error('Checkout cannot proceed. Please verify the payment details.');
      }
      return;
    }

    if (!this.bookingId) {
      this.alertService.error('Unable to complete checkout: booking information is missing.');
      return;
    }

    if (this.remainingDue > 0 && (!Number.isFinite(this.paymentTotal) || this.paymentTotal <= 0)) {
      this.alertService.error('Please enter a valid payment amount before checkout.');
      return;
    }

    if (this.remainingDue > 0 && this.paymentTotal < this.remainingDue) {
      this.alertService.error(`Please collect ${this.formatCurrency(this.amountShortfall)} more before checkout.`);
      return;
    }

    const payload = {
      bookingNumber: this.bookingNumber,
      guestName: this.guestName,
      roomNos: this.roomNos,
      payments: this.paymentEntries
        .filter((entry) => Number.isFinite(Number(entry.amount)) && Number(entry.amount) > 0)
        .map((entry) => ({
          paymentMode: entry.paymentMode,
          amount: Number(entry.amount),
          note: entry.note
        })),
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

  private loadBookingDetails(bookingId: number): void {
    this.loadingBooking = true;
    this.roomBills = [];
    this.http.get<any>(`${apiBaseUrl}/bookings/${bookingId}`).subscribe({
      next: (res) => {
        console.log('CheckoutComponent loadBookingDetails response', res);
        if (!res) {
          this.alertService.error('Unable to load booking details for checkout.');
          return;
        }

        this.bookingNumber = res.bookingNumber ?? this.bookingNumber;
        this.guestName = (res.guestName ?? `${res.guestFirstName ?? ''} ${res.guestLastName ?? ''}`.trim()) || this.guestName;
        this.roomNos = (res.rooms?.map((room: any) => room.roomNo ?? '').filter((r: string) => r).join(', ')) || res.roomNumbers || this.roomNos;

        const bookingCharge = Number(res.bookingCharge ?? res.totalAmount ?? 0);
        const gstAmount = Number(res.gstAmount ?? 0);
        const grandTotal = Number(res.grandTotal ?? res.totalAmount ?? 0);
        const advanceAmount = Number(res.advanceAmount ?? 0);
        const balanceDue = Number(res.balanceDue ?? Math.max(grandTotal - advanceAmount, 0));

        this.billing.roomRent = this.formatCurrency(bookingCharge);
        this.billing.totalTax = this.formatCurrency(gstAmount);
        this.billing.subtotal = this.formatCurrency(grandTotal);
        this.billing.advance = this.formatCurrency(advanceAmount);
        this.billing.due = this.formatCurrency(balanceDue);

        this.billing.amenity = this.billing.amenity || '₹0.00';
        this.billing.cancellation = this.billing.cancellation || '₹0.00';
        this.billing.refund = this.billing.refund || '₹0.00';

        this.remainingDue = balanceDue;
        this.updateBalance();

        const bookingRooms = Array.isArray(res.rooms) ? res.rooms : Array.isArray(res.Rooms) ? res.Rooms : [];

        if (bookingRooms.length > 0) {
          this.roomBills = bookingRooms.map((room: any, index: number) => ({
            no: index + 1,
            roomNo: room.roomNo ?? room.roomNo ?? '',
            roomType: room.roomTypeName ?? room.roomType ?? room.roomTypeName ?? room.mealPlan ?? '',
            from: this.formatLocalDateTime(room.checkIn ?? room.checkInDate ?? res.checkInDate ?? res.checkIn),
            to: this.formatLocalDateTime(room.checkOut ?? room.checkOutDate ?? res.checkOutDate ?? res.checkOut),
            nights: this.calculateNights(room.checkIn ?? room.checkInDate ?? res.checkInDate ?? res.checkIn, room.checkOut ?? room.checkOutDate ?? res.checkOutDate ?? res.checkOut),
            rent: this.formatCurrency(Number(room.roomAmount ?? room.totalAmount ?? 0))
          }));
        }

        this.computeTotals();
        this.updateBalance();
      },
      error: (err) => {
        console.error('Failed to load booking details:', err);
        this.alertService.error('Unable to load booking details for checkout.');
      },
      complete: () => {
        this.loadingBooking = false;
      }
    });
  }
}
