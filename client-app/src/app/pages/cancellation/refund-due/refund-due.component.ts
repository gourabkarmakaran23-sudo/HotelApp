import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { RefundService, RefundStatus } from '../../../services/refund.service';

@Component({
  selector: 'app-refund-due',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './refund-due.component.html',
  styleUrls: ['../refund-shared.scss']
})
export class RefundDueComponent implements OnInit {
  dueForm!: FormGroup;
  isModalOpen = false;
  dueList: any[] = [];

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
    this.dueForm = this.fb.group({
      id: [0], // এডিটের জন্য আইডি ট্র্যাকিং
      bookingId: ['', Validators.required],
      guestName: ['', Validators.required],
      bookingSource: ['Walk-In', Validators.required],
      refundAmount: [0, [Validators.required, Validators.min(1)]],
      requestDate: [new Date().toISOString().substring(0, 10), Validators.required],
      remarks: [''],
      status: [RefundStatus.Due] // ডেফল্ট স্ট্যাটাস 0
    });
  }

  loadData(): void {
    this.refundService.getRefundsByStatus(RefundStatus.Due).subscribe({
      next: (res) => this.dueList = res,
      error: (err) => this.alertService.error('Error loading due refunds: ' + err.message)
    });
  }

  openModal() { this.isModalOpen = true; }
  
  closeModal() { 
    this.isModalOpen = false; 
    this.dueForm.reset({ id: 0, bookingSource: 'Walk-In', refundAmount: 0, requestDate: new Date().toISOString().substring(0, 10), status: RefundStatus.Due }); 
  }

  submit() {
    if (this.dueForm.invalid) { this.dueForm.markAllAsTouched(); return; }
    
    const payload = this.dueForm.value;
    this.refundService.saveRefundRecord(payload).subscribe({
      next: (res) => {
        this.alertService.success(res.message || 'Refund Due Record Saved!');
        this.loadData();
        this.closeModal();
      },
      error: (err) => this.alertService.error('Save failed: ' + err.message)
    });
  }

  // এক্সট্রা বোনাস ফিচার: রেকর্ডটিকে সরাসরি "Under Process" স্টেজে পাঠিয়ে দেওয়ার জন্য বাটন লজিক
  moveToProcess(id: number) {
    this.alertService.confirm('Move this entry to Processing Desk?', () => {
      this.refundService.changeRefundStatus(id, RefundStatus.UnderProcess).subscribe({
        next: () => {
          this.alertService.success('Moved to processing pipeline successfully.');
          this.loadData();
        },
        error: (err) => this.alertService.error(err.message)
      });
    });
  }

  deleteItem(id: number) {
    this.alertService.confirm('Are you sure you want to delete this record?', () => {
      this.refundService.deleteRefund(id).subscribe({
        next: () => {
          this.alertService.success('Record deleted.');
          this.loadData();
        }
      });
    });
  }

  // ... আগের ইমপোর্ট এবং প্রোপার্টিজ ঠিক থাকবে ...

  // 📝 এডিট বাটনের কাজ: ফর্মের ভেতর এক্সিস্টিং ডাটা পুশ করা এবং মোডাল ওপেন করা
  editRecord(record: any): void {
    this.isModalOpen = true;
    this.dueForm.patchValue({
      id: record.id,
      bookingId: record.bookingId,
      guestName: record.guestName,
      bookingSource: record.bookingSource,
      refundAmount: record.refundAmount,
      requestDate: record.requestDate ? record.requestDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
      remarks: record.remarks,
      status: record.status
    });
  }

  // ❌ ডিলিট বাটনের কাজ: ডাটাবেজ থেকে IsDeleted = true করা
  deleteRecord(id: number): void {
    this.alertService.confirm('Are you sure you want to delete this due record?', () => {
      this.refundService.deleteRefund(id).subscribe({
        next: (res) => {
          this.alertService.success('Record deleted successfully.');
          this.loadData(); // টেবিল রিফ্রেশ
        },
        error: (err) => this.alertService.error('Delete failed: ' + err.message)
      });
    });
  }
}