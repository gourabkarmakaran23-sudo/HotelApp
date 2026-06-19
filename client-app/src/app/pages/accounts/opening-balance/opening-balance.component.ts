import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-opening-balance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.scss']
})
export class OpeningBalanceComponent implements OnInit {
  balances: any[] = [];
  showModal = false;
  isEditMode = false;
  selectedId = 0;
  balanceForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadBalances();
  }

  initializeForm(): void {
    this.balanceForm = this.fb.group({
      accountName: ['', Validators.required],
      accountType: ['Bank', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      balanceType: ['Debit', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      remarks: [''],
      isActive: [true]
    });
  }

  loadBalances(): void {
    this.accountService.getOpeningBalances().subscribe({
      next: (res: any[]) => this.balances = res,
      error: (err: any) => console.error('Error fetching opening balances', err)
    });
  }

  addNew(): void {
    this.isEditMode = false;
    this.selectedId = 0;
    this.balanceForm.reset({
      accountName: '',
      accountType: 'Bank',
      amount: 0,
      balanceType: 'Debit',
      date: new Date().toISOString().substring(0, 10),
      remarks: '',
      isActive: true
    });
    this.showModal = true;
  }

  edit(item: any): void {
    this.isEditMode = true;
    this.selectedId = item.id;
    this.balanceForm.patchValue({
      accountName: item.accountName,
      accountType: item.accountType || 'Bank',
      amount: item.amount,
      balanceType: item.balanceType || 'Debit',
      date: item.date ? item.date.substring(0, 10) : new Date().toISOString().substring(0, 10),
      remarks: item.remarks,
      isActive: item.isActive
    });
    this.showModal = true;
  }

  save(): void {
    if (this.balanceForm.invalid) return;

    const payload = this.balanceForm.value;
    if (this.isEditMode) {
      this.accountService.updateOpeningBalance(this.selectedId, payload).subscribe(() => {
        this.loadBalances();
        this.closeModal();
      });
    } else {
      this.accountService.createOpeningBalance(payload).subscribe(() => {
        this.loadBalances();
        this.closeModal();
      });
    }
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this ledger entry?')) {
      this.accountService.deleteOpeningBalance(id).subscribe(() => this.loadBalances());
    }
  }

  closeModal(): void {
    this.showModal = false;
  }
}