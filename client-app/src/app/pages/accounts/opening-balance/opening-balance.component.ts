import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-opening-balance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opening-balance.component.html'
})
export class OpeningBalanceComponent {
  openingBalance = {
    accountHead: '',
    totalAmount: null,
    remark: ''
  };

  saveOpeningBalance() {
    console.log('Saving Opening Balance Data:', this.openingBalance);
  }
}