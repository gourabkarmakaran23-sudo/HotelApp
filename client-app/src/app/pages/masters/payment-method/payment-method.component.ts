import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MasterService } from "../../../services/master.service";

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements OnInit {

  paymentMethods: any[] = [];
  showModal = false;
  isEditMode = false;
  selectedId = 0;
  paymentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadPaymentMethods();
  }

  initializeForm() {
    this.paymentForm = this.fb.group({
      methodName: ['', Validators.required],
      isActive: [true]
    });
  }

  loadPaymentMethods() {
    this.masterService.getPaymentMethods()
      .subscribe({
        next: (res) => {
          this.paymentMethods = res || [];
        },
        error: (err) => {
          console.error('Failed to parse payment methods registry:', err);
        }
      });
  }

  addNew() {
    this.isEditMode = false;
    this.selectedId = 0;
    this.paymentForm.reset({
      methodName: '',
      isActive: true
    });
    this.showModal = true;
  }

  edit(item: any) {
    this.isEditMode = true;
    this.selectedId = item.id;
    this.paymentForm.patchValue({
      methodName: item.methodName,
      isActive: item.isActive
    });
    this.showModal = true;
  }

  save() {
    if (this.paymentForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.masterService
        .updatePaymentMethod(this.selectedId, this.paymentForm.value)
        .subscribe(() => {
          this.loadPaymentMethods();
          this.closeModal();
        });
    } else {
      this.masterService
        .createPaymentMethod(this.paymentForm.value)
        .subscribe(() => {
          this.loadPaymentMethods();
          this.closeModal();
        });
    }
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this payment method?')) {
      this.masterService.deletePaymentMethod(id)
        .subscribe(() => {
          this.loadPaymentMethods();
        });
    }
  }

  closeModal() {
    this.showModal = false;
  }
}