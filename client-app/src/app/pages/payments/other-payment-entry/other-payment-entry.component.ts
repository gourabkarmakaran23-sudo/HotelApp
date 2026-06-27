import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CustomAlertService } from '../../../services/custom-alert.service'; 
import { OtherPaymentService } from '../../../services/other-payment.service';

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
  invoiceId: number | null = null;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private invoiceService: OtherPaymentService,
    private alertService: CustomAlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.invoiceId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    if (this.invoiceId) {
      this.loadInvoiceDetails(this.invoiceId);
    } else {
      this.addItemRow(); 
    }
  }

  initForm(): void {
    this.invoiceForm = this.fb.group({
      invoiceNo: ['', Validators.required],
      invoiceDate: [new Date().toISOString().substring(0, 10), Validators.required],
      customerName: ['', Validators.required],
      // 📱 মোবাইল নম্বর ভ্যালিডেশন ১০ থেকে ১৫ ডিজিটের জন্য সহজ ও ফ্লুয়েন্ট করা হলো
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
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
      type: ['Service'], // ভ্যালিডেটর শিথিল করা হলো যেন ব্যাকএন্ডে লক না হয়ে যায়
      hsn: [''],
      description: ['', Validators.required],
      unit: ['Pcs'],
      rate: [0, [Validators.required, Validators.min(0)]],
      qty: [1, [Validators.required, Validators.min(1)]],
      subTotal: [{ value: 0, disabled: true }],
      gstRate: [0], 
      gstType: ['CGST+SGST'],
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

  loadInvoiceDetails(id: number): void {
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (data) => {
        if (data) {
          this.invoiceForm.patchValue(data);
          while (this.items.length) {
            this.items.removeAt(0);
          }
          if (data.items && data.items.length > 0) {
            data.items.forEach((item: any) => {
              const itemGroup = this.fb.group({
                type: [item.type || 'Service'],
                hsn: [item.hsn || ''],
                description: [item.description || '', Validators.required],
                unit: [item.unit || 'Pcs'],
                rate: [item.rate || 0, [Validators.required, Validators.min(0)]],
                qty: [item.qty || 1, [Validators.required, Validators.min(1)]],
                subTotal: [{ value: item.subTotal || 0, disabled: true }],
                gstRate: [item.gstRate || 0],
                gstType: [item.gstType || 'CGST+SGST'],
                gstAmount: [{ value: item.gstAmount || 0, disabled: true }],
                total: [{ value: item.total || 0, disabled: true }]
              });
              this.items.push(itemGroup);
            });
          }
          this.calculateTotals();
        }
      },
      error: (err) => {
        this.alertService.error('Failed to load invoice details: ' + err.message);
      }
    });
  }

  onItemValueChange(index: number): void {
    const row = this.items.at(index);
    const qty = row.get('qty')?.value || 0;
    const rate = row.get('rate')?.value || 0;
    const gstRate = +row.get('gstRate')?.value || 0; // সংখ্যায় কনভার্ট নিশ্চিত করা হলো

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
      const gstRate = +control.get('gstRate')?.value || 0;

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

  // 🛠️ স্মার্ট ডায়াগনস্টিক মেথড যা নিখুঁতভাবে ইনভ্যালিড ফিল্ডের নাম খুঁজে বের করবে
  getFormValidationErrors(): string[] {
    const errors: string[] = [];
    
    // মেইন ফর্ম ইনপুট চেক
    Object.keys(this.invoiceForm.controls).forEach(key => {
      const controlErrors = this.invoiceForm.get(key)?.errors;
      if (controlErrors != null) {
        errors.push(`${key.toUpperCase()} is required or invalid`);
      }
    });

    // টেবিল গ্রিড রো ইনপুট চেক
    this.items.controls.forEach((element, index) => {
      const rowGroup = element as FormGroup;
      Object.keys(rowGroup.controls).forEach(key => {
        const rowControlErrors = rowGroup.get(key)?.errors;
        if (rowControlErrors != null) {
          errors.push(`Row ${index + 1} -> ${key.toUpperCase()} is required/invalid`);
        }
      });
    });

    return errors;
  }

  saveInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      const errorList = this.getFormValidationErrors();
      const detailedMessage = errorList.length > 0 
        ? `Missing Fields: ${errorList.join(', ')}` 
        : 'Please fill out all mandatory fields correctly.';
        
      this.alertService.error(detailedMessage);
      return;
    }
    
    // ১. ফর্মের ডিজেবল্ড (Sub Total, GST Amt, Total Gross) সহ সব রিয়েল ভ্যালু এক্সট্র্যাক্ট করা হলো
    const rawFormValues = this.invoiceForm.getRawValue();

    // ২. ব্যাকএন্ড ডাটাবেজের জন্য পেলোড ডাটা টাইপগুলো নিখুঁতভাবে কনভার্ট করা হলো
    const finalizedPayload = {
      invoiceNo: rawFormValues.invoiceNo ? rawFormValues.invoiceNo.toString() : '',
      invoiceDate: rawFormValues.invoiceDate,
      customerName: rawFormValues.customerName,
      mobile: rawFormValues.mobile ? rawFormValues.mobile.toString() : '',
      customerAddress: rawFormValues.customerAddress || '',
      gstin: rawFormValues.gstin || '',
      remarks: rawFormValues.remarks || '',
      
      // প্রধান সামারি ফিল্ডগুলোকে ফ্লোট/নাম্বার নিশ্চিত করা
      subTotalSummary: Number(rawFormValues.subTotalSummary || 0),
      totalGstSummary: Number(rawFormValues.totalGstSummary || 0),
      adjustment: Number(rawFormValues.adjustment || 0),
      roundOff: Number(rawFormValues.roundOff || 0),
      invoiceAmount: Number(rawFormValues.invoiceAmount || 0),
      id: this.invoiceId ? Number(this.invoiceId) : 0, // ডাটাবেজ ইন্টিজারের জন্য ০ অথবা আইডি
      attachmentName: this.selectedFile ? this.selectedFile.name : null,

      // টেবিল গ্রিডের প্রতিটি অবজেক্টের ডাটা টাইপ পিওর নাম্বার ও স্ট্রিং ফরম্যাটিং করা হলো
      items: (rawFormValues.items || []).map((item: any) => ({
        type: item.type ? item.type.toString() : 'Service',
        hsn: item.hsn ? item.hsn.toString() : '',
        description: item.description ? item.description.toString() : '',
        unit: item.unit ? item.unit.toString() : 'Pcs',
        rate: Number(item.rate || 0),
        qty: Number(item.qty || 0),
        subTotal: Number(item.subTotal || 0),
        gstRate: Number(item.gstRate || 0), // ড্রপডাউন স্ট্রিং থেকে পিওর নাম্বার
        gstType: item.gstType ? item.gstType.toString() : 'CGST+SGST',
        gstAmount: Number(item.gstAmount || 0),
        total: Number(item.total || 0)
      }))
    };

    console.log('Sending Pure Clean Payload to Backend API:', finalizedPayload);

    // ৩. সাবমিশন কল
    this.invoiceService.createInvoice(finalizedPayload).subscribe({
      next: (res) => {
        this.alertService.success(res?.message || 'Invoice Saved Successfully in Database!');
        this.router.navigate(['/payment/other-list']);
      },
      error: (err) => {
        // যদি এখনও ব্যাকএন্ড থেকে এরর আসে, এপিআই এর পাঠানো আসল কারণটি এখানে দেখাবে
        const serverErrorMessage = err.error?.message || err.error || err.message;
        this.alertService.error('API validation failed: ' + JSON.stringify(serverErrorMessage));
      }
    });
  }
}