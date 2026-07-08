import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-debit-voucher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './debit-voucher.component.html',
  styleUrls: ['../accounts.scss']
})
export class DebitVoucherComponent {
  voucherNo = 'DV-2026-001';
  voucherDate = '2026-07-08';
  creditAccountHead = 'Cash in hand';
  remark = '';
  
  rows = [{ accountName: '', code: '', amount: 0 }];

  addNewRow() {
    this.rows.push({ accountName: '', code: '', amount: 0 });
  }

  removeRow(index: number) {
    if (this.rows.length > 1) {
      this.rows.splice(index, 1);
    }
  }

  calculateTotal(): number {
    return this.rows.reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  saveVoucher() {
    console.log('Debit Voucher Saved:', {
      voucherNo: this.voucherNo,
      date: this.voucherDate,
      rows: this.rows,
      total: this.calculateTotal()
    });
  }
}