import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { apiBaseUrl } from '../../app.config';

interface PaymentSplitLine {
  paymentType: string;
  amount: number;
  remarks: string;
}

interface PaymentListItem {
  id?: number;
  receiptNo: string;
  date: string;
  paidAmount: number;
  paymentMode: string;
  paidFor: string;
  remarks: string;
}

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  bookingId: number | null = null;
  bookingDetails: any = null;
  payments: PaymentListItem[] = [];
  showAddModal = false;
  modalError = '';

  paymentForm = {
    bookingNumber: '',
    dueAmount: 0,
    invoiceId: 0
  };

  splitPayments: PaymentSplitLine[] = [
    { paymentType: '', amount: 0, remarks: '' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookingService: BookingService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) this.bookingId = Number(idParam);
    const qId = this.route.snapshot.queryParamMap.get('bookingId');
    if (!this.bookingId && qId) this.bookingId = Number(qId);

    if (!this.bookingId) {
      return;
    }

    this.loadData();
  }

  get splitTotal(): number {
    return this.splitPayments.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  }

  get remainingDue(): number {
    return Math.max(0, this.paymentForm.dueAmount - this.splitTotal);
  }

  loadData(): void {
    if (!this.bookingId) return;

    this.bookingService.getBookingById(this.bookingId).subscribe({
      next: (b) => {
        this.bookingDetails = b;
        this.paymentForm.bookingNumber = b?.bookingNumber ?? '';
        this.paymentForm.dueAmount = Number(b?.balanceDue ?? b?.dueAmount ?? 0);
        this.paymentForm.invoiceId = Number(b?.invoiceId ?? 0);
        this.payments = [];

        this.http.get<any[]>(`${apiBaseUrl}/payments/booking/${this.bookingId}`).subscribe({
          next: (list) => {
            this.payments = list.map((p) => ({
              id: p.id,
              receiptNo: p.receiptNo || '',
              date: p.paymentDate || p.date || new Date().toISOString(),
              paidAmount: Number(p.amount ?? p.paidAmount ?? 0),
              paymentMode: p.paymentMode || p.method || 'Cash',
              paidFor: p.paidFor || 'Room',
              remarks: p.remarks || ''
            }));
          },
          error: () => {
            this.addAdvanceFallback(b);
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch booking', err);
      }
    });
  }

  addAdvanceFallback(b: any): void {
    const advance = Number(b?.advanceAmount ?? 0);
    if (advance > 0) {
      this.payments.push({
        receiptNo: `REC-ADV-${b?.id ?? '0'}`,
        date: b?.invoiceDate ?? new Date().toISOString(),
        paidAmount: advance,
        paymentMode: b?.paymentMode ?? 'Advance',
        paidFor: 'Advance',
        remarks: b?.advanceRemarks ?? 'Advance payment received'
      });
    }
  }

  openAddModal(): void {
    this.modalError = '';
    this.splitPayments = [{ paymentType: '', amount: 0, remarks: '' }];
    this.paymentForm = {
      bookingNumber: this.bookingDetails?.bookingNumber ?? '',
      dueAmount: Number(this.bookingDetails?.balanceDue ?? this.bookingDetails?.dueAmount ?? 0),
      invoiceId: Number(this.bookingDetails?.invoiceId ?? 0)
    };
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
  }

  addSplitRow(): void {
    this.splitPayments.push({ paymentType: '', amount: 0, remarks: '' });
  }

  removeSplitRow(index: number): void {
    if (this.splitPayments.length <= 1) {
      this.splitPayments = [{ paymentType: '', amount: 0, remarks: '' }];
      return;
    }
    this.splitPayments.splice(index, 1);
  }

  validateSplitPayments(): boolean {
    this.modalError = '';
    if (this.splitPayments.length === 0) {
      this.modalError = 'Add at least one payment line.';
      return false;
    }

    for (const [index, row] of this.splitPayments.entries()) {
      if (!row.paymentType) {
        this.modalError = `Payment type is required for row ${index + 1}.`;
        return false;
      }
      if (!row.amount || row.amount <= 0) {
        this.modalError = `Amount must be greater than 0 for row ${index + 1}.`;
        return false;
      }
    }

    if (this.splitTotal > this.paymentForm.dueAmount) {
      this.modalError = 'Total split payments cannot exceed the due amount.';
      return false;
    }

    return true;
  }

  addPayment(): void {
    if (!this.validateSplitPayments()) {
      return;
    }

    const totalPayment = this.splitTotal;
    const createRequests = this.splitPayments.map((line) => ({
      bookingId: this.bookingId,
      invoiceId: this.paymentForm.invoiceId || undefined,
      amount: line.amount,
      paymentMode: line.paymentType,
      remarks: line.remarks || ''
    }));

    forkJoin(
      createRequests.map((payload) =>
        this.http.post<any>(`${apiBaseUrl}/payments`, payload)
      )
    ).subscribe({
      next: (results) => {
        results.forEach((result, index) => {
          const payload = createRequests[index];
          this.payments.push({
            id: result?.id,
            receiptNo: result?.receiptNo ?? `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toISOString(),
            paidAmount: payload.amount,
            paymentMode: payload.paymentMode,
            paidFor: 'Room',
            remarks: payload.remarks
          });
        });

        this.paymentForm.dueAmount = Math.max(0, this.paymentForm.dueAmount - totalPayment);
        if (this.bookingDetails) {
          this.bookingDetails.balanceDue = this.paymentForm.dueAmount;
          this.bookingDetails.dueAmount = this.paymentForm.dueAmount;
        }
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to save payment', err);
        this.modalError = 'Unable to save one or more payments. Please try again.';
      }
    });
  }

  back(): void {
    this.router.navigateByUrl('/booking-list');
  }

  deletePayment(idx: number): void {
    const payment = this.payments[idx];
    if (payment?.id) {
      this.http.delete(`${apiBaseUrl}/payments/${payment.id}`).subscribe({
        next: () => {
          this.payments.splice(idx, 1);
        },
        error: () => {
          this.payments.splice(idx, 1);
        }
      });
      return;
    }
    this.payments.splice(idx, 1);
  }
}
