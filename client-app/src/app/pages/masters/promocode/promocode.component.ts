import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-promos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './promocode.component.html', // এটি আপডেট করুন
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {
  promocodes: any[] = [];
  showModal = false;
  isEditMode = false;
  selectedId = 0;
  promoForm!: FormGroup;

  constructor(private fb: FormBuilder, private masterService: MasterService) {}

  ngOnInit(): void {
    this.promoForm = this.fb.group({
      code: ['', Validators.required],
      discountType: ['Percentage', Validators.required],
      discountValue: [0, [Validators.required, Validators.min(0)]],
      minimumBookingAmount: [0],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      maxUses: [100],
      isActive: [true]
    });
    this.loadPromos();
  }

  loadPromos() {
    this.masterService.getPromocodes().subscribe(res => this.promocodes = res);
  }

save() {
    if (this.promoForm.invalid) return;

    if (this.isEditMode) {
      this.masterService.updatePromocode(this.selectedId, this.promoForm.value).subscribe({
        next: () => {
          this.loadPromos();
          this.showModal = false;
        },
        error: (err) => console.error(err)
      });
    } else {
      this.masterService.createPromocode(this.promoForm.value).subscribe({
        next: () => {
          this.loadPromos();
          this.showModal = false;
        },
        error: (err) => console.error(err)
      });
    }
  }
  deleteItem(id: number) {
    if(confirm('Delete promo code?')) this.masterService.deletePromocode(id).subscribe(() => this.loadPromos());
  }
}