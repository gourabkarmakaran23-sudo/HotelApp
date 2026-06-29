import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomAlertService } from '../../../services/custom-alert.service';

type RefundTab = 'due' | 'process' | 'refunded';

@Component({
  selector: 'app-refund-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './refund-management.component.html',
  styleUrls: ['./refund-management.component.scss']
})
export class RefundManagementComponent implements OnInit {
  currentTab: RefundTab = 'due';
  isModalOpen = false;
  
  // ফর্ম গ্রুপসমূহ
  dueForm!: FormGroup;
  processForm!: FormGroup;
  refundedForm!: FormGroup;

  // টেবিল লিস্টের মক ডাটা (ইমেজ গ্রিড ট্র্যাকিং অনুসারে)
  dueList: any[] = [
    { id: 1, bookingId: 'BK-9081', guestName: 'Amit Sharma', source: 'Walk-In', refAmount: 4500, requestDate: '2026-06-25' },
    { id: 2, bookingId: 'BK-3342', guestName: 'Priya Patel', source: 'MakeMyTrip', refAmount: 2800, requestDate: '2026-06-27' }
  ];

  processList: any[] = [
    { id: 1, bookingId: 'BK-1102', guestName: 'John Doe', refAmount: 6200, bankName: 'SBI', status: 'Pending Approval' }
  ];

  refundedList: any[] = [
    { id: 1, bookingId: 'BK-7701', guestName: 'S. Das', refAmount: 1250, channel: 'UPI / GPay', txnId: 'TXN9982711', date: '2026-06-20' }
  ];

  constructor(private fb: FormBuilder, private alertService: CustomAlertService) {}

  ngOnInit(): void {
    this.initForms();
  }

  // ট্যাব পরিবর্তনের মেথড
  switchTab(tab: RefundTab): void {
    this.currentTab = tab;
  }

  // ইমেজ স্ট্রাকচার অনুযায়ী সব ফর্মের ভ্যালিডেশন ডিক্লেয়ারেশন
  initForms(): void {
    // ১. Refund Due Form
    this.dueForm = this.fb.group({
      bookingId: ['', Validators.required],
      guestName: ['', Validators.required],
      bookingSource: ['Walk-In', Validators.required],
      refundAmount: [0, [Validators.required, Validators.min(1)]],
      requestDate: [new Date().toISOString().substring(0, 10), Validators.required],
      remarks: ['']
    });

    // ২. Refund Under Process Form
    this.processForm = this.fb.group({
      bookingId: ['', Validators.required],
      guestName: ['', Validators.required],
      refundAmount: [0, [Validators.required, Validators.min(1)]],
      bankName: ['', Validators.required],
      accountNo: ['', Validators.required],
      ifscCode: ['', Validators.required],
      processStatus: ['Sent to Accounts', Validators.required]
    });

    // ৩. Refunded Form
    this.refundedForm = this.fb.group({
      bookingId: ['', Validators.required],
      guestName: ['', Validators.required],
      refundAmount: [0, [Validators.required, Validators.min(1)]],
      refundChannel: ['UPI / GPay', Validators.required],
      transactionId: ['', Validators.required],
      refundedDate: [new Date().toISOString().substring(0, 10), Validators.required],
      attachment: [null]
    });
  }

  openAddModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.dueForm.reset({ bookingSource: 'Walk-In', refundAmount: 0, requestDate: new Date().toISOString().substring(0, 10) });
    this.processForm.reset({ refundAmount: 0, processStatus: 'Sent to Accounts' });
    this.refundedForm.reset({ refundAmount: 0, refundChannel: 'UPI / GPay', refundedDate: new Date().toISOString().substring(0, 10) });
  }

  // ফ্রন্টএন্ড সাময়িক সাবমিট লজিক (যা পরবর্তীতে ব্যাকএন্ডে পুশ হবে)
  submitForm(): void {
    if (this.currentTab === 'due') {
      if (this.dueForm.invalid) { this.dueForm.markAllAsTouched(); return; }
      const data = this.dueForm.value;
      this.dueList.push({ id: Date.now(), bookingId: data.bookingId, guestName: data.guestName, source: data.bookingSource, refAmount: data.refundAmount, requestDate: data.requestDate });
      this.alertService.success('Refund Due Record Added Successfully (Frontend Mode)!');
    } 
    else if (this.currentTab === 'process') {
      if (this.processForm.invalid) { this.processForm.markAllAsTouched(); return; }
      const data = this.processForm.value;
      this.processList.push({ id: Date.now(), bookingId: data.bookingId, guestName: data.guestName, refAmount: data.refundAmount, bankName: data.bankName, status: data.processStatus });
      this.alertService.success('Processing Record Tracked Successfully!');
    } 
    else if (this.currentTab === 'refunded') {
      if (this.refundedForm.invalid) { this.refundedForm.markAllAsTouched(); return; }
      const data = this.refundedForm.value;
      this.refundedList.push({ id: Date.now(), bookingId: data.bookingId, guestName: data.guestName, refAmount: data.refundAmount, channel: data.refundChannel, txnId: data.transactionId, date: data.refundedDate });
      this.alertService.success('Final Refund Settlement Record Archived!');
    }
    this.closeModal();
  }

  deleteRecord(id: number, type: RefundTab): void {
    this.alertService.confirm('Are you sure you want to remove this record from view?', () => {
      if (type === 'due') this.dueList = this.dueList.filter(x => x.id !== id);
      if (type === 'process') this.processList = this.processList.filter(x => x.id !== id);
      if (type === 'refunded') this.refundedList = this.refundedList.filter(x => x.id !== id);
      this.alertService.success('Record removed successfully.');
    });
  }
}