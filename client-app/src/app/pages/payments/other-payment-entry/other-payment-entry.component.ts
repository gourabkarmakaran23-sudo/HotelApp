import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomAlertService } from '../../../services/custom-alert.service'; // আপনার কাস্টম অ্যালার্ট সার্ভিস পথ মিলিয়ে নেবেন

@Component({
  selector: 'app-other-payment-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './other-payment-entry.component.html',
  styleUrls: ['./other-payment-entry.component.scss']
})
export class OtherPaymentEntryComponent implements OnInit {
  invoiceForm!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private alertService: CustomAlertService // কাস্টম অ্যালার্ট এখানে ইনজেক্ট করা হলো
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.addItemRow(); 
  }

  initForm(): void {
    this.invoiceForm = this.fb.group({
      invoiceNo: ['', Validators.required],
      invoiceDate: [new Date().toISOString().substring(0, 10), Validators.required],
      customerName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      customerAddress: [''],
      gstin: [''],
      remarks: [''],
      items: this.fb.array([]),
      subTotalSummary: [0],
      totalGstSummary: [0],
      adjustment: [0],
      roundOff: [0],
      invoiceAmount: [0]
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItemRow(): void {
    const itemGroup = this.fb.group({
      type: ['Service', Validators.required],
      hsn: [''],
      description: ['', Validators.required],
      unit: ['Pcs', Validators.required],
      rate: [0, [Validators.required, Validators.min(0)]],
      qty: [1, [Validators.required, Validators.min(1)]],
      subTotal: [{ value: 0, disabled: true }],
      gstRate: [18, Validators.required], 
      gstType: ['CGST+SGST', Validators.required],
      gstAmount: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }]
    });

    this.items.push(itemGroup);
    this.calculateTotals();
  }

  removeItemRow(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateTotals();
    }
  }

  onItemValueChange(index: number): void {
    const row = this.items.at(index);
    const qty = row.get('qty')?.value || 0;
    const rate = row.get('rate')?.value || 0;
    const gstRate = row.get('gstRate')?.value || 0;

    const subTotal = qty * rate;
    const gstAmount = (subTotal * gstRate) / 100;
    const total = subTotal + gstAmount;

    row.patchValue({
      subTotal: subTotal,
      gstAmount: gstAmount,
      total: total
    }, { emitEvent: false });

    this.calculateTotals();
  }

  calculateTotals(): void {
    let subTotalAccumulator = 0;
    let gstAccumulator = 0;

    this.items.controls.forEach((control) => {
      const qty = control.get('qty')?.value || 0;
      const rate = control.get('rate')?.value || 0;
      const gstRate = control.get('gstRate')?.value || 0;

      const rowSub = qty * rate;
      const rowGst = (rowSub * gstRate) / 100;

      subTotalAccumulator += rowSub;
      gstAccumulator += rowGst;
    });

    const adjustment = this.invoiceForm.get('adjustment')?.value || 0;
    const rawGrandTotal = subTotalAccumulator + gstAccumulator + adjustment;
    const roundedGrandTotal = Math.round(rawGrandTotal);
    const roundOff = roundedGrandTotal - rawGrandTotal;

    this.invoiceForm.patchValue({
      subTotalSummary: subTotalAccumulator,
      totalGstSummary: gstAccumulator,
      roundOff: roundOff,
      invoiceAmount: roundedGrandTotal
    }, { emitEvent: false });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  saveInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      // 🆕 আপনার কাস্টম অ্যালার্ট সার্ভিস কল
      this.alertService.error('Please fill out all mandatory fields correctly.');
      return;
    }
    
    const payload = {
      ...this.invoiceForm.getRawValue(),
      attachmentName: this.selectedFile ? this.selectedFile.name : null
    };

    console.log('Submitting Invoice Matrix Data:', payload);
    
    // 🆕 কাস্টম সাকসেস অ্যালার্ট পপআপ
    this.alertService.success('Invoice saved successfully! Moving back to List.');
    this.router.navigate(['/payment/other-list']);
  }
}