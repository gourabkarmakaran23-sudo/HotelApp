import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular'; // ১. এটি ইমপোর্ট করুন

@Component({
  selector: 'app-voucher-approval',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule // ২. এখানে ইমপোর্টস অ্যারেতে অবশ্যই এটি যুক্ত করুন
  ],
  templateUrl: './voucher-approval.component.html'
})
export class VoucherApprovalComponent {
  // আপনার গ্রিডের ডেটা এবং কলাম ডেফিনিশন এখানে ডিফাইন করা আছে নিশ্চয়ই
  public rowData: any[] = []; 
  public columnDefs: any[] = []; 
}