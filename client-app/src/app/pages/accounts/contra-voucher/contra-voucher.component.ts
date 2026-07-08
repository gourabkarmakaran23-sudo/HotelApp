import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contra-voucher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contra-voucher.component.html'
})
export class ContraVoucherComponent {
  voucherNo = 'CONTRA-2026-001';
  voucherDate = '2026-07-08';
  remark = '';

  rows = [{ accountName: '', code: '', debit: 0, credit: 0 }];

  addNewRow() {
    this.rows.push({ accountName: '', code: '', debit: 0, credit: 0 });
  }

  removeRow(index: number) {
    if (this.rows.length > 1) this.rows.splice(index, 1);
  }

  saveVoucher() {
    console.log('Contra Voucher Saved:', this.rows);
  }
}