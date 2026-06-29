import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { RefundService, RefundStatus } from '../../../services/refund.service';

@Component({
  selector: 'app-refunded-archive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './refunded-archive.component.html',
  styleUrls: ['../refund-shared.scss']
})
export class RefundedArchiveComponent implements OnInit {
  refundedForm!: FormGroup;
  isModalOpen = false;
  refundedList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private alertService: CustomAlertService,
    private refundService: RefundService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.refundedForm = this.fb.group({
      id: [0],
      bookingId: ['', Validators.required],
      guestName: ['', Validators.required],
      // ⬇️ নিশ্চিত করুন এই নামগুলো আপনার ব্যাকএন্ড এবং HTML ফর্ম কন্ট্রোলের সাথে মিলছে
      refundAmount: [0, [Validators.required, Validators.min(1)]],
      refundChannel: ['UPI / GPay', Validators.required],
      transactionId: ['', Validators.required],
      refundedDate: [new Date().toISOString().substring(0, 10), Validators.required],
      status: [RefundStatus.Refunded] // Status = 2
    });
  }

  
  loadData(): void {
    this.refundService.getRefundsByStatus(RefundStatus.Refunded).subscribe({
      next: (res) => this.refundedList = res,
      error: (err) => this.alertService.error('Error: ' + err.message)
    });
  }

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; this.refundedForm.reset({ id: 0, refundAmount: 0, refundChannel: 'UPI / GPay', refundedDate: new Date().toISOString().substring(0, 10), status: RefundStatus.Refunded }); }

  submit() {
    if (this.refundedForm.invalid) { this.refundedForm.markAllAsTouched(); return; }

    const payload = this.refundedForm.value;
    this.refundService.saveRefundRecord(payload).subscribe({
      next: (res) => {
        this.alertService.success('Historical Closed Settle Archived!');
        this.loadData();
        this.closeModal();
      }
    });
  }
  // ... আগের কোড ঠিক থাকবে ...

  editRecord(record: any): void {
    this.isModalOpen = true;

    // ⬇️ patchValue করার সময় অবজেক্টের কী (Key) গুলো ব্যাকএন্ড রেসপন্সের সাথে হুবহু মিলতে হবে
    this.refundedForm.patchValue({
      id: record.id,
      bookingId: record.bookingId,
      guestName: record.guestName,
      refundAmount: record.refundAmount,       // ফিক্সড নাম
      refundChannel: record.refundChannel,     // ফিক্সড নাম
      transactionId: record.transactionId,     // ফিক্সড নাম
      refundedDate: record.refundedDate ? record.refundedDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
      status: record.status
    });
  }

  deleteRecord(id: number): void {
    this.alertService.confirm('Are you sure you want to delete this processing record?', () => {
      this.refundService.deleteRefund(id).subscribe({
        next: () => {
          this.alertService.success('Processing log removed.');
          this.loadData();
        }
      });
    });
  }

}