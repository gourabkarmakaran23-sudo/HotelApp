import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-ledger.component.html'
})
export class GeneralLedgerComponent {
  glHead = '';
  transactionHead = '';
  fromDate = '2026-04-30';
  toDate = '2026-04-30';
  withDetails = false;

  ledgers = [
    { id: 101, code: '10201', name: 'Cash & Cash Equivalent', type: 'Asset', balance: 28400.00 }
  ];

  onFind() { console.log('Finding Ledger Records...'); }
  onAdd() { console.log('Add New Ledger Account'); }
  onEdit(item: any) { console.log('Editing Ledger', item); }
  onDelete(id: number) { console.log('Deleting Ledger', id); }
}