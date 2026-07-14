import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { RefundService, RefundStatus } from '../../../services/refund.service';

@Component({
  selector: 'app-refund-process',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './refund-process.component.html',
  styleUrls: ['../refund-shared.scss']
})
export class RefundProcessComponent implements OnInit {
  processForm!: FormGroup;
  isModalOpen = false;
  processList: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private alertService: CustomAlertService,
    private refundService: RefundService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.processForm = this.fb.group({
      id: [0],
      bookingId: ['', Validators.required],
      guestName: ['', Validators.required],
      refundAmount: [0, [Validators.required, Validators.min(1)]],
      bankName: ['', Validators.required],
      accountNo: ['', Validators.required],
      ifscCode: ['', Validators.required],
      processStatus: ['Sent to Accounts', Validators.required],
      status: [RefundStatus.UnderProcess] // স্ট্যাটাস 1
    });
  }

  loadData(): void {
    this.refundService.getRefundsByStatus(RefundStatus.UnderProcess).subscribe({
      next: (res) => this.processList = res,
      error: (err) => this.alertService.error('Error: ' + err.message)
    });
  }

  openModal() { this.isModalOpen = true; }
  closeModal() { this.isModalOpen = false; this.processForm.reset({ id: 0, refundAmount: 0, processStatus: 'Sent to Accounts', status: RefundStatus.UnderProcess }); }

  submit() {
    if (this.processForm.invalid) { this.processForm.markAllAsTouched(); return; }
    
    const payload = this.processForm.value;
    this.refundService.saveRefundRecord(payload).subscribe({
      next: (res) => {
        this.alertService.success('Processing Record Updated in DB!');
        this.loadData();
        this.closeModal();
      }
    });
  }

  // এই প্রোসেসিং রেকর্ডটিকে ফাইনাল Settle বা "Refunded" আর্কাইভে পাঠানোর বাটন লজিক
  moveToArchive(id: number) {
    this.alertService.confirm('Mark this payment as Final Settle & Archive?', () => {
      this.refundService.changeRefundStatus(id, RefundStatus.Refunded).subscribe({
        next: () => {
          this.alertService.success('Moved to historical Refunded Archives!');
          this.loadData();
        }
      });
    });
  }

  // ... আগের কোড ঠিক থাকবে ...

  editRecord(record: any): void {
    this.isModalOpen = true;
    this.processForm.patchValue({
      id: record.id,
      bookingId: record.bookingId,
      guestName: record.guestName,
      refundAmount: record.refundAmount,
      bankName: record.bankName,
      accountNo: record.accountNo,
      ifscCode: record.ifscCode,
      processStatus: record.processStatus,
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