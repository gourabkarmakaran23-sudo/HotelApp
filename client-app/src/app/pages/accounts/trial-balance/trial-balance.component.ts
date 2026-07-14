import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trial-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trial-balance.component.html'
})
export class TrialBalanceComponent {
  trialBalanceData = [
    { code: '10201', name: 'Cash & Cash Equivalent', debit: 28400.00, credit: 0.00 },
    { code: '303', name: 'Service', debit: 0.00, credit: 32200.00 }
  ];

  totalDebit = 28400.00;
  totalCredit = 32200.00;

  onPrint() { window.print(); }
  onAdd() { console.log('Add New Entry Event'); }
  onEdit(row: any) { console.log('Edit item', row); }
  onDelete(row: any) { console.log('Delete item', row); }
}