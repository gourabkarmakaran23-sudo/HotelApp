import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // 👈 ActivatedRoute নিশ্চিত করুন
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
    private route: ActivatedRoute, // 👈 আইডি রিড করার জন্য
    private invoiceService: OtherPaymentService,
    private alertService: CustomAlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // 🔍 ইউআরএল থেকে আইডি প্যারামিটার রিড করা হচ্ছে
    const idParam = this.route.snapshot.paramMap.get('id');
    this.invoiceId = idParam ? +idParam : null;

    if (this.invoiceId) {
      this.loadInvoiceDetails(this.invoiceId);
    } else {
      this.addItemRow(); // নতুন ইনভয়েসের জন্য ফাঁকা রো
    }
  }

  initForm(): void {
    this.invoiceForm = this.fb.group({
      invoiceNo: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      customerName: ['', Validators.required],
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
      type: ['Service'],
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

  // 🔄 ডাটাবেজ থেকে এক্সিস্টিং ডাটা এনে ফর্মে ডিসপ্লে করার মূল মেথড
  // 🔄 ডাটাবেজ থেকে এক্সিস্টিং ডাটা এনে ফর্মে ডিসপ্লে করার ১০০% সেফ মেথড
  // 🔄 ডাটাবেজ থেকে এক্সিস্টিং ডাটা এনে ফর্মে ডিসপ্লে করার ১০০% ফুল-প্রুফ মেথড
  // 🔄 ডাটাবেজ থেকে এক্সিস্টিং ডাটা এনে ফর্মে ডিসপ্লে করার ১০০% পিওর মেথড
  loadInvoiceDetails(id: number): void {
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (data) => {
        if (data) {
          console.log('Database API Response Raw Data:', data);

          // ১. মেইন মাস্টার ফর্ম ডেটা ম্যাপ করা
          this.invoiceForm.patchValue({
            invoiceNo: data.invoiceNo || data.InvoiceNo,
            invoiceDate: (data.invoiceDate || data.InvoiceDate) ? (data.invoiceDate || data.InvoiceDate).substring(0, 10) : '',
            customerName: data.customerName || data.CustomerName,
            mobile: data.mobile || data.Mobile,
            customerAddress: data.customerAddress || data.CustomerAddress || '',
            gstin: data.gstin || data.Gstin || '',
            remarks: data.remarks || data.Remarks || '',
            subTotalSummary: data.subTotalSummary || data.SubTotalSummary || 0,
            totalGstSummary: data.totalGstSummary || data.TotalGstSummary || 0,
            adjustment: data.adjustment || data.Adjustment || 0,
            roundOff: data.roundOff || data.RoundOff || 0,
            invoiceAmount: data.invoiceAmount || data.InvoiceAmount || 0
          });

          // ২. আইটেম গ্রিড ফর্মঅ্যারে ট্র্যাকিং রেফারেন্স নেওয়া এবং মেমোরি ফ্লাশ করা
          const itemFormArray = this.invoiceForm.get('items') as FormArray;
          itemFormArray.clear(); 

          // ৩. ব্যাকএন্ড DTO থেকে ম্যাপ হয়ে আসা Items কালেকশন রিড করা
          const dbItems = data.items || data.Items || [];

          if (dbItems && dbItems.length > 0) {
            dbItems.forEach((item: any) => {
              // ডেটা টাইপ সেফটি কনভার্সন
              const currentRate = Number(item.rate || item.Rate || 0);
              const currentQty = Number(item.qty || item.Qty || 1);
              const currentGstRate = Number(item.gstRate || item.GstRate || 0);

              const calculatedSubTotal = currentQty * currentRate;
              const calculatedGstAmount = (calculatedSubTotal * currentGstRate) / 100;
              const calculatedTotal = calculatedSubTotal + calculatedGstAmount;

              const itemGroup = this.fb.group({
                type: [item.type || item.Type || 'Service'],
                hsn: [item.hsn || item.Hsn || ''],
                description: [item.description || item.Description || '', Validators.required],
                unit: [item.unit || item.Unit || 'Pcs'],
                rate: [currentRate, [Validators.required, Validators.min(0)]],
                qty: [currentQty, [Validators.required, Validators.min(1)]],
                subTotal: [{ value: item.subTotal || item.SubTotal || calculatedSubTotal, disabled: true }],
                gstRate: [currentGstRate],
                gstType: [item.gstType || item.GstType || 'CGST+SGST'],
                gstAmount: [{ value: item.gstAmount || item.GstAmount || calculatedGstAmount, disabled: true }],
                total: [{ value: item.total || item.Total || calculatedTotal, disabled: true }]
              });

              itemFormArray.push(itemGroup);
            });
          } else {
            // যদি ডাটাবেজে ওল্ড কোনো রো কোনো কারণে না পাওয়া যায়
            this.addItemRow();
          }

          // ৪. ডম (DOM) রিঅ্যাক্টিভিটি ফোর্সড রিলিজ এবং টোটাল সামারি রিক্যালকুলেশন
          setTimeout(() => {
            this.calculateTotals();
            this.invoiceForm.updateValueAndValidity();
          }, 50);
        }
      },
      error: (err) => {
        this.alertService.error('Failed to load existing invoice: ' + err.message);
      }
    });
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
    const gstRate = +row.get('gstRate')?.value || 0;

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

  getFormValidationErrors(): string[] {
    const errors: string[] = [];
    Object.keys(this.invoiceForm.controls).forEach(key => {
      const controlErrors = this.invoiceForm.get(key)?.errors;
      if (controlErrors != null) {
        errors.push(`${key.toUpperCase()}`);
      }
    });
    this.items.controls.forEach((element, index) => {
      const rowGroup = element as FormGroup;
      Object.keys(rowGroup.controls).forEach(key => {
        const rowControlErrors = rowGroup.get(key)?.errors;
        if (rowControlErrors != null) {
          errors.push(`Row ${index + 1} -> ${key.toUpperCase()}`);
        }
      });
    });
    return errors;
  }

  saveInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      const errorList = this.getFormValidationErrors();
      this.alertService.error(`Missing or Invalid Fields: ${errorList.join(', ')}`);
      return;
    }
    
    const rawFormValues = this.invoiceForm.getRawValue();
    const finalizedPayload = {
      invoiceNo: rawFormValues.invoiceNo ? rawFormValues.invoiceNo.toString() : '',
      invoiceDate: rawFormValues.invoiceDate,
      customerName: rawFormValues.customerName,
      mobile: rawFormValues.mobile ? rawFormValues.mobile.toString() : '',
      customerAddress: rawFormValues.customerAddress || '',
      gstin: rawFormValues.gstin || '',
      remarks: rawFormValues.remarks || '',
      subTotalSummary: Number(rawFormValues.subTotalSummary || 0),
      totalGstSummary: Number(rawFormValues.totalGstSummary || 0),
      adjustment: Number(rawFormValues.adjustment || 0),
      roundOff: Number(rawFormValues.roundOff || 0),
      invoiceAmount: Number(rawFormValues.invoiceAmount || 0),
      id: this.invoiceId ? Number(this.invoiceId) : 0, 
      attachmentName: this.selectedFile ? this.selectedFile.name : null,

      items: (rawFormValues.items || []).map((item: any) => ({
        type: item.type ? item.type.toString() : 'Service',
        hsn: item.hsn ? item.hsn.toString() : '',
        description: item.description ? item.description.toString() : '',
        unit: item.unit ? item.unit.toString() : 'Pcs',
        rate: Number(item.rate || 0),
        qty: Number(item.qty || 0),
        subTotal: Number(item.subTotal || 0),
        gstRate: Number(item.gstRate || 0),
        gstType: item.gstType ? item.gstType.toString() : 'CGST+SGST',
        gstAmount: Number(item.gstAmount || 0),
        total: Number(item.total || 0)
      }))
    };

    this.invoiceService.createInvoice(finalizedPayload).subscribe({
      next: (res) => {
        this.alertService.success(res?.message || 'Invoice Saved Successfully!');
        this.router.navigate(['/payment/other-list']);
      },
      error: (err) => {
        const serverErrorMessage = err.error?.message || err.error || err.message;
        this.alertService.error('API Save Error: ' + JSON.stringify(serverErrorMessage));
      }
    });
  }
}