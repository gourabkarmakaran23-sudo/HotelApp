import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OtherPaymentService } from '../../../services/other-payment.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-other-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './other-payment-list.component.html', // এটি আপডেট করুন
  styleUrls: ['./other-payment-list.component.scss']
})
export class OtherPaymentListComponent implements OnInit {
  invoiceForm!: FormGroup;
  savedInvoices: any[] = [];
  isListView = true; // টগল ভিউ কন্ট্রোল করার জন্য

  constructor(private fb: FormBuilder, private invoiceService: OtherPaymentService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadInvoices();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      invoiceNo: ['INV-' + Math.floor(100000 + Math.random() * 900000), Validators.required],
      invoiceDate: [new Date().toISOString().substring(0, 10), Validators.required],
      customerName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      customerAddress: [''],
      gstin: [''],
      remarks: [''],
      subTotalSummary: [0],
      totalGstSummary: [0],
      adjustment: [0],
      roundOff: [0],
      invoiceAmount: [0],
      paidAmount: [0],
      items: this.fb.array([]) // Dynamic Line Grid Rows
    });

    // ফর্ম লোড হওয়ার সময় ডিফল্ট ১টি ফাকা রো জেনারেট করে দেওয়া হলো
    this.addItemRow();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItemRow() {
    const row = this.fb.group({
      type: ['Service', Validators.required],
      hsn: [''],
      description: ['', Validators.required],
      unit: ['Pcs', Validators.required],
      rate: [0, [Validators.required, Validators.min(0.01)]],
      qty: [1, [Validators.required, Validators.min(1)]],
      subTotal: [{ value: 0, disabled: true }],
      gstRate: [18, Validators.required],
      gstType: ['CGST+SGST', Validators.required],
      gstAmount: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }]
    });

    row.valueChanges.subscribe(() => this.calculateRowTotals(row));
    this.items.push(row);
  }

  removeItemRow(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateGrandTotals();
    }
  }

  calculateRowTotals(row: FormGroup) {
    const qty = row.get('qty')?.value || 0;
    const rate = row.get('rate')?.value || 0;
    const gstRate = row.get('gstRate')?.value || 0;

    const subTotal = qty * rate;
    const gstAmount = (subTotal * gstRate) / 100;
    const total = subTotal + gstAmount;

    row.get('subTotal')?.setValue(subTotal, { emitEvent: false });
    row.get('gstAmount')?.setValue(gstAmount, { emitEvent: false });
    row.get('total')?.setValue(total, { emitEvent: false });

    this.calculateGrandTotals();
  }

  calculateGrandTotals() {
    let subTotalSum = 0;
    let gstSum = 0;

    this.items.controls.forEach((ctrl) => {
      subTotalSum += ctrl.get('subTotal')?.value || 0;
      gstSum += ctrl.get('gstAmount')?.value || 0;
    });

    const adjustment = this.invoiceForm.get('adjustment')?.value || 0;
    const rawTotal = subTotalSum + gstSum + adjustment;
    const finalTotal = Math.round(rawTotal);
    const roundOff = finalTotal - rawTotal;

    this.invoiceForm.patchValue({
      subTotalSummary: subTotalSum,
      totalGstSummary: gstSum,
      roundOff: roundOff,
      invoiceAmount: finalTotal
    }, { emitEvent: false });
  }

  loadInvoices() {
    this.invoiceService.getInvoices().subscribe(res => this.savedInvoices = res);
  }

  submitInvoice() {
    if (this.invoiceForm.invalid) {
      alert('Please fill out all mandatory fields correctly before saving!');
      return;
    }

    // FormArray এর disabled ফিল্ডগুলোর মান সহ অবজেক্ট জেনারেট করার জন্য getRawValue() ব্যবহার করতে হবে
    const payload = this.invoiceForm.getRawValue();

    this.invoiceService.createInvoice(payload).subscribe({
      next: (res) => {
        alert(res.message || 'Invoice Saved Successfully in Database!');
        this.initForm();
        this.loadInvoices();
        this.isListView = true; // সেভ হওয়ার সাথে সাথে লিস্ট ভিউতে নিয়ে যাবে
      },
      error: (err) => alert('Backend tracking error: ' + err.message)
    });
  }

  deleteInvoice(id: number) {
    if (confirm('Are you sure you want to permanently remove this revenue invoice record?')) {
      this.invoiceService.deleteInvoice(id).subscribe(() => this.loadInvoices());
    }
  }
}