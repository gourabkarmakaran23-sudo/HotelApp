import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OtherPaymentService } from '../../../services/other-payment.service';
import { RouterModule, Router } from '@angular/router';
import { CustomAlertService } from '../../../services/custom-alert.service'; // 👈 কাস্টম অ্যালার্ট সার্ভিস ইমপোর্ট

@Component({
  selector: 'app-other-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './other-payment-list.component.html',
  styleUrls: ['./other-payment-list.component.scss']
})
export class OtherPaymentListComponent implements OnInit {
  savedInvoices: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private invoiceService: OtherPaymentService,
    private alertService: CustomAlertService, // 👈 কাস্টম অ্যালার্ট ইনজেকশন
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (res) => {
        this.savedInvoices = res;
      },
      error: (err) => {
        this.alertService.error('Error fetching invoices: ' + err.message);
      }
    });
  }

  // 🗑️ কাস্টম অ্যালার্ট মেকানিজম ব্যবহার করে ডিলিট অপারেশন
  deleteInvoice(id: number): void {
    // আপনার সার্ভিসের .confirm মেথড কল করা হলো যা পিওর কাস্টম মোডাল উইন্ডো পপ-আপ করবে
    this.alertService.confirm(
      'Are you absolutely sure you want to permanently delete this invoice record?',
      () => {
        // ইউজার ওকেরানি বা কনফার্ম বাটনে ক্লিক করলে এই ব্লকের কোড চলবে (onConfirm callback)
        this.invoiceService.deleteInvoice(id).subscribe({
          next: (res) => {
            if (res) {
              this.alertService.success('The invoice record has been deleted successfully.');
              this.loadInvoices(); // টেবিল ডাটা রিফ্রেশ করা হলো
            } else {
              this.alertService.warning('Could not complete deletion or record not found.');
            }
          },
          error: (err) => {
            this.alertService.error('Failed to execute delete routine: ' + err.message);
          }
        });
      },
      () => {
        // ক্যানসেল করলে চাইলে নোটিফিকেশন দিতে পারেন, না দিলে ফাকা রাখতে পারেন
        console.log('User cancelled delete action.');
      }
    );
  }
}