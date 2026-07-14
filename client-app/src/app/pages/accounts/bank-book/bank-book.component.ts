import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-book.component.html'
})
export class BankBookComponent {
  glHead = '';
  accountCode = '';
  fromDate = '2026-04-30';
  toDate = '2026-04-30';

  records = [
    { id: 1, date: '2026-04-30', particulars: 'Opening Balance', voucherNo: '-', debit: 0.00, credit: 0.00, balance: 50000.00 },
    { id: 2, date: '2026-04-30', particulars: 'Cash Deposit', voucherNo: 'CONTRA-01', debit: 15000.00, credit: 0.00, balance: 65000.00 }
  ];

  onFind() {
    console.log('Searching bank book...', { glHead: this.glHead, fromDate: this.fromDate, toDate: this.toDate });
  }

  onAdd() { console.log('Add new entry'); }
  onEdit(row: any) { console.log('Edit row', row); }
  onDelete(id: number) { console.log('Delete row id', id); }
}