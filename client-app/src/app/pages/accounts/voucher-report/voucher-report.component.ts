import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-voucher-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voucher-report.component.html'
})
export class VoucherReportComponent {
  searchDate = '2026-07-08 00:00:00';
  reports = [
    { 
      voucherNo: 'CV-BAC-2026-07-08 00:00:00', 
      remarks: 'Aggregated Cash Credit Voucher', 
      amount: 8400, 
      date: '2026-07-08 00:00:00' 
    }
  ];

  fetchReport() {
    console.log('Fetching report data for date:', this.searchDate);
  }
}