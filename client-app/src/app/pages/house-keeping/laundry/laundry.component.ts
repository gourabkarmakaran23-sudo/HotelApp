import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HouseKeepingService } from '../../../services/house-keeping.service';

@Component({
  selector: 'app-laundry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './laundry.component.html',
    styleUrls:['../house-keeping-shared.css']
})
export class LaundryComponent implements OnInit {
  laundryForm!: FormGroup;
  laundryLogs: any[] = [];
  isModalOpen = false;

  constructor(private readonly fb: FormBuilder, private readonly hkService: HouseKeepingService) {}

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
      itemCost: [0, Validators.required],
      quantity: [1, Validators.required],
      type: ['Linens'],
      sendDate: [new Date().toISOString().substring(0, 10), Validators.required],
      paymentStatus: ['Pending']
    });
  }

  loadData(): void {
    this.hkService.getLaundryLogs().subscribe(res => this.laundryLogs = res);
  }

  openModal(data: any = null) {
    this.isModalOpen = true;
    if(data) this.laundryForm.patchValue(data);
    else this.laundryForm.reset({id: 0, itemCost: 0, quantity: 1, sendDate: new Date().toISOString().substring(0, 10)});
  }

  submitLog() {
    if (this.laundryForm.invalid) return;
    this.hkService.saveLaundryLog(this.laundryForm.value).subscribe(() => {
      this.loadData();
      this.isModalOpen = false;
    });
  }
}