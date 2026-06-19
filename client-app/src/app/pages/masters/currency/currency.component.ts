import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MasterService } from "../../../services/master.service";

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  currencies: any[] = [];
  showModal = false;
  isEditMode = false;
  selectedId = 0;
  currencyForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrencies();
  }

  initializeForm() {
    this.currencyForm = this.fb.group({
      currencyName: ['', Validators.required],
      currencyIcon: ['', Validators.required],
      position: ['Left', Validators.required],
      conversionRate: [1, [Validators.required, Validators.min(0.0001)]],
      isActive: [true]
    });
  }

  loadCurrencies() {
    this.masterService.getCurrencies()
      .subscribe({
        next: (res) => {
          this.currencies = res || [];
        },
        error: (err) => {
          console.error('Failed to parse currencies repository:', err);
        }
      });
  }

  addNew() {
    this.isEditMode = false;
    this.selectedId = 0;
    this.currencyForm.reset({
      currencyName: '',
      currencyIcon: '',
      position: 'Left',
      conversionRate: 1,
      isActive: true
    });
    this.showModal = true;
  }

  edit(item: any) {
    this.isEditMode = true;
    this.selectedId = item.id;
    this.currencyForm.patchValue({
     currencyName: item.currencyName || item.name,
      currencyIcon: item.currencyIcon,
      position: item.position || 'Left',
      conversionRate: item.conversionRate,
      isActive: item.isActive
    });
    this.showModal = true;
  }

  save() {
    if (this.currencyForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.masterService
        .updateCurrency(this.selectedId, this.currencyForm.value)
        .subscribe(() => {
          this.loadCurrencies();
          this.closeModal();
        });
    } else {
      this.masterService
        .createCurrency(this.currencyForm.value)
        .subscribe(() => {
          this.loadCurrencies();
          this.closeModal();
        });
    }
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this currency template entry?')) {
      this.masterService.deleteCurrency(id)
        .subscribe(() => {
          this.loadCurrencies();
        });
    }
  }

  closeModal() {
    this.showModal = false;
  }
}