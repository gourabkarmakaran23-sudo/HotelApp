import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service';

@Component({
  selector: 'app-laundry-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './laundry-payment.component.html',
    styleUrls:['../house-keeping-shared.css']
})
export class LaundryPaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  payments: any[] = [];
  isModalOpen = false;

  constructor(private readonly fb: FormBuilder, private readonly hkService: HouseKeepingService) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      invoiceNo: ['', Validators.required],
      laundryName: ['', Validators.required],
      totalAmount: [0, Validators.required],
      dueAmount: [0],
      paidAmount: [0, Validators.required]
    });
    this.loadData();
  }

  loadData() {
    this.hkService.getLaundryPayments().subscribe(res => this.payments = res);
  }

  openModal(data: any = null) {
    this.isModalOpen = true;
    if (data) this.paymentForm.patchValue(data);
    else this.paymentForm.reset({ id: 0, totalAmount: 0, dueAmount: 0, paidAmount: 0 });
  }

  savePayment() {
    if (this.paymentForm.invalid) return;
    this.hkService.saveLaundryPayment(this.paymentForm.value).subscribe(() => {
      this.loadData();
      this.isModalOpen = false;
    });
  }

  deletePayment(id: number) {
    if(confirm('Delete payment record?')) {
      this.hkService.deleteLaundryPayment(id).subscribe(() => this.loadData());
    }
  }
}