import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profit-loss',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profit-loss.component.html'
})
export class ProfitLossComponent {
  incomeItems = [
    { name: 'Service', amount: 32200.00 }
  ];
  totalIncome = 32200.00;

  expenseItems = [
    { name: 'Office Rent', amount: 0.00 }
  ];
  totalExpense = 0.00;
  netProfit = 32200.00;

  onPrint() { window.print(); }
  onAdd() { console.log('Create dynamic ledger accounts entry row'); }
  onEdit(node: any) { console.log('Edit dynamic stream node data', node); }
  onDelete(node: any) { console.log('Delete dynamic entry node data', node); }
}