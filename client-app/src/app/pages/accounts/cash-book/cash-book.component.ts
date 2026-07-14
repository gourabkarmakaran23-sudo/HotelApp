import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cash-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cash-book.component.html'
})
export class CashBookComponent {
  fromDate = '2026-07-01';
  toDate = '2026-07-08';

  printReport() {
    window.print();
  }

  searchCashBook() {
    console.log(`Filtering Cash Book data from ${this.fromDate} to ${this.toDate}`);
  }
}