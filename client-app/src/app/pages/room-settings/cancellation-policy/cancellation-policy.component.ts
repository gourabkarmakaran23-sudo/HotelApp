import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-cancellation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cancellation-policy.component.html',
  styleUrls:['./cancellation-policy.component.scss']

})
export class CancellationPolicyComponent implements OnInit {
  policies: any[] = [];
  showModal = false;
  isEditMode = false;
  selectedId = 0;
  policyForm!: FormGroup;

  constructor(private fb: FormBuilder, private masterService: MasterService) {}

  ngOnInit(): void {
    this.policyForm = this.fb.group({
      policyName: ['', Validators.required],
      cancellationWindowHours: [24, Validators.required],
      chargePercentage: [100, Validators.required],
      description: [''],
      isActive: [true]
    });
    this.loadPolicies();
  }

  loadPolicies() {
    this.masterService.getCancellationPolicies().subscribe(res => this.policies = res);
  }

  save() {
    if (this.policyForm.invalid) return;

    if (this.isEditMode) {
      this.masterService.updateCancellationPolicy(this.selectedId, this.policyForm.value).subscribe({
        next: () => {
          this.loadPolicies();
          this.showModal = false;
        },
        error: (err) => console.error(err)
      });
    } else {
      this.masterService.createCancellationPolicy(this.policyForm.value).subscribe({
        next: () => {
          this.loadPolicies();
          this.showModal = false;
        },
        error: (err) => console.error(err)
      });
    }
  }

  deleteItem(id: number) {
    if(confirm('Delete policy?')) this.masterService.deleteCancellationPolicy(id).subscribe(() => this.loadPolicies());
  }
}