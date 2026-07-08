import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-financial-year-end',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-year-end.component.html'
})
export class FinancialYearEndComponent {
  triggerYearEndProcess() {
    const confirmAction = confirm('Are you sure you want to end the current financial year? This will carry over balances.');
    if (confirmAction) {
      console.log('Financial year-end process executed successfully.');
    }
  }
}