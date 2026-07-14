import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-tax',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss']
})
export class TaxComponent implements OnInit {
  taxes: any[] = [];
  showModal = false;
  isEditMode = false;
  selectedId = 0;
  taxForm!: FormGroup;

  constructor(private fb: FormBuilder, private masterService: MasterService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTaxes();
  }

  initializeForm() {
    this.taxForm = this.fb.group({
      taxName: ['', Validators.required],
      taxRate: [0, [Validators.required, Validators.min(0)]],
      taxCode: ['', Validators.required],
      isActive: [true]
    });
  }

  loadTaxes() {
    this.masterService.getTaxes().subscribe(res => this.taxes = res);
  }

  addNew() {
    this.isEditMode = false;
    this.taxForm.reset({ taxName: '', taxRate: 0, taxCode: '', isActive: true });
    this.showModal = true;
  }

  edit(item: any) {
    this.isEditMode = true;
    this.selectedId = item.id;
    this.taxForm.patchValue(item);
    this.showModal = true;
  }

  save() {
    if (this.taxForm.invalid) return;

    if (this.isEditMode) {
      this.masterService.updateTax(this.selectedId, this.taxForm.value).subscribe(() => {
        this.loadTaxes();
        this.showModal = false;
      });
    } else {
      this.masterService.createTax(this.taxForm.value).subscribe(() => {
        this.loadTaxes();
        this.showModal = false;
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this Tax rule?')) {
      this.masterService.deleteTax(id).subscribe(() => this.loadTaxes());
    }
  }
}