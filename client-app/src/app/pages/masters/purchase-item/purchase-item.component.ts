import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-purchase-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-item.component.html',
  styleUrls: ['./purchase-item.component.scss'] // Inherit shared blueprint styles directly
})
export class PurchaseItemComponent implements OnInit {
  items: any[] = [];
  selectedItem: any = this.initEmptyModel();
  isEditMode = false;
  isLoading = false;
  errorMessage = '';

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.masterService.getPurchaseItems().subscribe({
      next: (res) => { this.items = res; this.isLoading = false; },
      error: () => { this.errorMessage = 'Could not load purchase history registry items.'; this.isLoading = false; }
    });
  }

  calculateTotal(): void {
    const qty = this.selectedItem.quantity || 0;
    const rate = this.selectedItem.rate || 0;
    this.selectedItem.totalAmount = qty * rate;
  }

  openEditMode(row: any): void {
    this.isEditMode = true;
    this.selectedItem = { ...row };
    if (this.selectedItem.purchaseDate) {
      this.selectedItem.purchaseDate = this.selectedItem.purchaseDate.split('T')[0];
    }
  }

 saveItem(): void {
  // Ensure strict number conversion for C# decimal/int binding
  const explicitPayload = {
    ...this.selectedItem,
    quantity: Number(this.selectedItem.quantity),
    rate: Number(this.selectedItem.rate),
    totalAmount: Number(this.selectedItem.totalAmount)
  };

  this.isLoading = true;
  this.masterService.createPurchaseItem(explicitPayload).subscribe({
    next: () => {
      this.resetForm();
      this.loadItems();
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = 'Failed to submit transaction adjustments.';
      this.isLoading = false;
    }
  });
}

  deleteItem(id: number): void {
    if(!confirm('Delete this stock receipt item row entry?')) return;
    this.masterService.deletePurchaseItem(id).subscribe({
      next: () => this.loadItems(),
      error: () => this.errorMessage = 'Failed to drop item row reference trace.'
    });
  }

  resetForm(): void {
    this.selectedItem = this.initEmptyModel();
    this.isEditMode = false;
    this.errorMessage = '';
  }

  private initEmptyModel() {
    return { itemName: '', supplierName: '', invoiceNumber: '', quantity: 1, unit: 'Pcs', rate: 0, totalAmount: 0, purchaseDate: new Date().toISOString().split('T')[0], remarks: '' };
  }
}