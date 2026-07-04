import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service';

@Component({
  selector: 'app-laundry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './laundry.component.html',
  styleUrls: ['../house-keeping-shared.css']
})
export class LaundryComponent implements OnInit {
  laundryForm!: FormGroup;
  laundryLogs: any[] = [];
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
    this.laundryForm = this.fb.group({
      id: [0],
      invoiceNo: ['', Validators.required],
      laundryName: ['', Validators.required],
      itemName: ['', Validators.required],
      operateBy: ['', Validators.required],
      taskName: ['', Validators.required],
      itemCost: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      type: ['Linens'],
      sendDate: [new Date().toISOString().substring(0, 10), Validators.required],
      paymentStatus: ['Pending']
    });
  }

  loadData(): void {
    this.hkService.getLaundryLogs().subscribe({
      next: (res: any) => {
        if (res && res.$values) {
          this.laundryLogs = res.$values;
        } else {
          this.laundryLogs = res;
        }
      },
      error: (err) => console.error('Error fetching laundry records:', err)
    });
  }

  openModal(data: any = null): void {
    this.isModalOpen = true;
    if (data) {
      this.laundryForm.patchValue({
        id: data.id,
        invoiceNo: data.invoiceNo,
        laundryName: data.laundryName,
        itemName: data.itemName,
        operateBy: data.operateBy,
        taskName: data.taskName,
        itemCost: data.itemCost,
        quantity: data.quantity,
        type: data.type || 'Linens',
        sendDate: data.sendDate ? data.sendDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
        paymentStatus: data.paymentStatus || 'Pending'
      });
    } else {
      this.laundryForm.reset({
        id: 0,
        itemCost: 0,
        quantity: 1,
        type: 'Linens',
        sendDate: new Date().toISOString().substring(0, 10),
        paymentStatus: 'Pending'
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveRecord(): void {
    if (this.laundryForm.invalid) {
      alert('Please fill out all required fields marked with an asterisk (*).');
      return;
    }

    const payload = this.laundryForm.value;
    this.hkService.saveLaundryLog(payload).subscribe({
      next: (res) => {
        this.closeModal();
        this.loadData();
      },
      error: (err) => console.error('Error saving laundry log record:', err)
    });
  }

  deleteLog(id: number): void {
    if (confirm('Are you sure you want to delete this invoice record from the master log?')) {
      // Points safely to the laundry log endpoint method
      this.hkService.deleteLaundryLog(id).subscribe({
        next: (res) => {
          this.loadData();
        },
        error: (err) => console.error('Error deleting record entry:', err)
      });
    }
  }
}