import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-purchase-return',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.scss'] // Use shared styles
})
export class PurchaseReturnComponent implements OnInit {
  returns: any[] = [];
  selectedReturn: any = this.initEmptyModel();
  isEditMode = false;
  isLoading = false;
  errorMessage = '';

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.loadReturns();
  }

  loadReturns(): void {
    this.isLoading = true;
    this.masterService.getPurchaseReturns().subscribe({
      next: (res) => { this.returns = res; this.isLoading = false; },
      error: () => { this.errorMessage = 'Could not download logged inventory returns registry ledger.'; this.isLoading = false; }
    });
  }

  calculateRefund(): void {
    const qty = this.selectedReturn.returnQuantity || 0;
    const rate = this.selectedReturn.refundRate || 0;
    this.selectedReturn.totalRefundAmount = qty * rate;
  }

  openEditMode(row: any): void {
    this.isEditMode = true;
    this.selectedReturn = { ...row };
    if (this.selectedReturn.returnDate) {
      this.selectedReturn.returnDate = this.selectedReturn.returnDate.split('T')[0];
    }
  }

  saveReturn(): void {
    this.isLoading = true;
    const task$ = this.isEditMode 
      ? this.masterService.updatePurchaseReturn(this.selectedReturn.id, this.selectedReturn)
      : this.masterService.createPurchaseReturn(this.selectedReturn);

    task$.subscribe({
      next: () => { this.resetForm(); this.loadReturns(); },
      error: () => { this.errorMessage = 'Failed to submit modifications onto active database schema.'; this.isLoading = false; }
    });
  }

  deleteReturn(id: number): void {
    if(!confirm('Permanently wipe out this return logging item row?')) return;
    this.masterService.deletePurchaseReturn(id).subscribe({
      next: () => this.loadReturns(),
      error: () => this.errorMessage = 'Failed to cancel tracking context.'
    });
  }

  resetForm(): void {
    this.selectedReturn = this.initEmptyModel();
    this.isEditMode = false;
    this.errorMessage = '';
  }

  private initEmptyModel() {
    return { itemName: '', supplierName: '', referenceInvoiceNo: '', returnQuantity: 1, unit: 'Pcs', refundRate: 0, totalRefundAmount: 0, returnDate: new Date().toISOString().split('T')[0], reasonForReturn: '' };
  }
}