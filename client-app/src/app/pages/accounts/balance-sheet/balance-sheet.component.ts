import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './balance-sheet.component.html'
})
export class BalanceSheetComponent {
  fromDate = '2026-04-30';
  toDate = '2026-04-30';

  currentAssets = [
    { name: 'Cash & Cash Equivalent', amount: null, isHeader: true },
    { name: 'Cash In Hand', amount: 28400.00, isHeader: false },
    { name: 'Advance, Deposit And Pre-payments', amount: null, isHeader: true },
    { name: 'Account Receivable', amount: null, isHeader: true }
  ];
  totalCurrentAssets = 28400.00;

  nonCurrentAssets = [
    { name: 'Furniture & Fixturers', amount: null },
    { name: 'Office Equipment', amount: null },
    { name: 'Groceries and Cutleries', amount: null }
  ];

  onFind() { console.log('Loading Balance Sheet Records...'); }
  onPrint() { window.print(); }
  onAdd() { console.log('Add New Configuration Property Context'); }
  onEdit(row: any) { console.log('Edit Row Parameter Entry', row); }
  onDelete(row: any) { console.log('Delete Row Parameter Entry', row); }
}