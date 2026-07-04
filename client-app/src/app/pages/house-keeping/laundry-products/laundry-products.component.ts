import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service';
import { CustomAlertService } from '../../../services/custom-alert.service';

@Component({
  selector: 'app-laundry-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './laundry-products.component.html',
  styleUrls: ['../house-keeping-shared.css']
})
export class LaundryProductsComponent implements OnInit {
  products: any[] = []; 
  productForm!: FormGroup;
  isModalOpen = false;

  constructor(
    private readonly hkService: HouseKeepingService,
    private readonly fb: FormBuilder,
    private readonly alertService: CustomAlertService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      id: [0],
      productName: ['', Validators.required],
      type: ['In Use', Validators.required], 
      comments: ['Inventory Update Log', Validators.required],
      inUse: [0, [Validators.required, Validators.min(0)]],
      inLaundry: [0, [Validators.required, Validators.min(0)]],
      ready: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadProducts(): void {
    this.hkService.getLaundryLogs().subscribe({
      next: (res: any) => {
        // Safe check if your backend returns wrapped metadata strings or direct lists
        if (res && res.$values) {
          this.products = res.$values;
        } else if (Array.isArray(res)) {
          this.products = res;
        } else {
          this.products = [];
        }
      },
      error: (err) => console.error('Error loading inventory data rows:', err)
    });
  }

  openModal(data: any = null): void {
    this.isModalOpen = true;
    if (data) {
      // 🚀 FIXED: Mapping backend DTO properties (itemName) accurately back into the editing form view controls
      this.productForm.patchValue({
        id: data.id ?? 0,
        productName: data.itemName ?? data.productName ?? '',
        type: data.type ?? 'In Use',
        comments: data.comments ?? 'Inventory Update Log',
        inUse: data.inUse ?? 0,
        inLaundry: data.inLaundry ?? 0,
        ready: data.ready ?? 0
      });
    } else {
      this.productForm.reset({ 
        id: 0, 
        type: 'In Use', 
        comments: 'Inventory Update Log', 
        inUse: 0, 
        inLaundry: 0, 
        ready: 0 
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveProduct(): void {
  if (this.productForm.invalid) {
    this.alertService.warning('Please fill in all required operational log fields.');
    return;
  }

  const rawValue = this.productForm.value;

  // Find the existing product if editing, to preserve its genuine invoice number
  const existingProduct = this.products.find(p => p.id === Number(rawValue.id));

  const payload = {
    id: Number(rawValue.id || 0),
    itemName: String(rawValue.productName || '').trim(), 
    taskName: 'Laundry Distribution Update',
    type: String(rawValue.type || 'In Use'),
    comments: String(rawValue.comments || 'Inventory Update Log').trim(),
    
    // 🚀 FIX: Never send an empty string. If editing, keep old invoice. If new, generate a random one.
    invoiceNo: rawValue.id > 0 
      ? (existingProduct?.invoiceNo || 'INV-' + rawValue.id) 
      : 'INV-' + Math.floor(100000 + Math.random() * 900000),
      
    laundryName: 'Internal Resort Laundry',
    operateBy: 'Housekeeping Desk', // Added fallback to match your DTO specification
    paymentStatus: 'Paid',
    itemCost: 0,
    quantity: Number(rawValue.inUse || 0) + Number(rawValue.inLaundry || 0) + Number(rawValue.ready || 0),

    // New inventory count columns
    inUse: Number(rawValue.inUse || 0),
    inLaundry: Number(rawValue.inLaundry || 0),
    ready: Number(rawValue.ready || 0)
  };

  console.log('Sending Fixed Payload to Backend:', payload);

  this.hkService.saveLaundryLog(payload).subscribe({
    next: (res) => {
      this.alertService.success('Laundry inventory log saved successfully.');
      this.closeModal();
      this.loadProducts();
    },
    error: (err) => {
      console.error('Validation save error backend response payload:', err);
      // Extra logging to show you exactly which field .NET is crying about
      if (err.error && err.error.errors) {
        console.error('Validation Details:', err.error.errors);
      }
      this.alertService.error('Failed to update laundry entry. Check console logs for property errors.');
    }
  });
}

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to completely remove this inventory log record?')) {
      // 🚀 FIXED: Pointing to the proper deleteLaundryLog method
      this.hkService.deleteLaundryLog(id).subscribe({
        next: (res) => {
          this.alertService.success('Inventory log record deleted successfully.');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Delete action failure:', err);
          this.alertService.error('Could not remove log record.');
        }
      });
    }
  }
}