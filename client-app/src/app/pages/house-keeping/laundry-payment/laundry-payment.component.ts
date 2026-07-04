import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service';

@Component({
  selector: 'app-laundry-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './laundry-payment.component.html',
  styleUrls: ['../house-keeping-shared.css']
})
export class LaundryPaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  payments: any[] = [];
  isModalOpen = false;

  constructor(
    private readonly fb: FormBuilder, 
    private readonly hkService: HouseKeepingService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      invoiceNo: ['', Validators.required],
      laundryName: ['', Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      dueAmount: [0],
      paidAmount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadData(): void {
    this.hkService.getLaundryPayments().subscribe({
      next: (res: any) => {
        if (res && res.$values) {
          this.payments = res.$values;
        } else {
          this.payments = res;
        }
      },
      error: (err) => console.error('Error fetching laundry payments ledger:', err)
    });
  }

  openModal(data: any = null): void {
    this.isModalOpen = true;
    if (data) {
      this.paymentForm.patchValue({
        id: data.id,
        name: data.name,
        invoiceNo: data.invoiceNo,
        laundryName: data.laundryName,
        totalAmount: data.totalAmount,
        dueAmount: data.dueAmount,
        paidAmount: data.paidAmount
      });
    } else {
      this.paymentForm.reset({
        id: 0,
        totalAmount: 0,
        dueAmount: 0,
        paidAmount: 0
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  savePayment(): void {
    if (this.paymentForm.invalid) {
      alert('Please fill in all mandatory entry fields correctly.');
      return;
    }

    const formValues = this.paymentForm.value;
    
    // 🧠 Auto calculate due dynamic balances safely
    const total = Number(formValues.totalAmount || 0);
    const paid = Number(formValues.paidAmount || 0);
    const calculatedDue = total - paid;

    const payload = {
      ...formValues,
      totalAmount: total,
      paidAmount: paid,
      dueAmount: calculatedDue >= 0 ? calculatedDue : 0
    };

    this.hkService.saveLaundryPayment(payload).subscribe({
      next: (res) => {
        this.closeModal();
        this.loadData();
      },
      error: (err) => console.error('Failed saving ledger transaction item:', err)
    });
  }

  deletePayment(id: number): void {
    if (confirm('Are you certain you want to erase this payment record from history logs?')) {
      this.hkService.deleteLaundryPayment(id).subscribe({
        next: (res) => {
          this.loadData();
        },
        error: (err) => console.error('Error deleting specific database entity index row:', err)
      });
    }
  }
}