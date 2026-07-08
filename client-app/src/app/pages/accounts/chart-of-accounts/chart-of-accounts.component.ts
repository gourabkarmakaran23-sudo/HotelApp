import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 ১. এটি ইমপোর্ট করুন
import { AgGridModule } from 'ag-grid-angular'; // 👈 ৩ নম্বর সমস্যার সমাধানও একসাথে
import { ColDef } from 'ag-grid-community';
@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,   // 👈 ২. এখানে যুক্ত করুন
    AgGridModule   // 👈 এখানে ag-grid মডিউলটি যুক্ত করুন
  ],
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['../accounts.scss']
})
export class ChartOfAccountsComponent {
  isFormOpen = false
  accountHead = { name: '', code: '', type: '', parent: '' };

  // 👈 : ColDef[] টাইপটি এখানে বসিয়ে দিন
public columnDefs: ColDef[] = [
  { 
    headerName: 'Serial', 
    valueGetter: 'node ? node.rowIndex + 1 : null', // সেফ নাল চেকিং সহ ভ্যালু গেটার
    width: 80 
  },
  { 
    headerName: 'Account Name', 
    field: 'name', 
    width: 200, 
    sortable: true, 
    filter: true 
  },
  { 
    headerName: 'Code', 
    field: 'code', 
    width: 120,
    sortable: true, 
    filter: true 
  },
  { 
    headerName: 'Type', 
    field: 'type', 
    width: 150,
    sortable: true, 
    filter: true 
  },
  { 
    headerName: 'Parent', 
    field: 'parent', 
    width: 200,
    sortable: true, 
    filter: true 
  }
];
//   columnDefs = [
//     { headerName: 'SL', valueGetter: 'node.rowIndex + 1', width: 70 },
//     { headerName: 'Account Code', field: 'code', width: 140, sortable: true, filter: true },
//     { headerName: 'Account Head', field: 'name', width: 240, sortable: true, filter: true },
//     { headerName: 'Account Type', field: 'type', width: 160 },
//     { headerName: 'Parent Head', field: 'parent', width: 180 },
//     { 
//       headerName: 'Action', 
//       width: 150, 
//       cellRenderer: () => `
//         <button style="background:#e2e8f0; border:none; padding:3px 8px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:600; color:#334155; margin-right:5px;">Edit</button>
//         <button style="background:#fee2e2; border:none; padding:3px 8px; border-radius:4px; font-size:12px; cursor:pointer; font-weight:600; color:#dc2626;">Delete</button>
//       ` 
//     }
//   ];

  rowData = [
    { code: '101001', name: 'Cash In Hand', type: 'Asset', parent: 'Current Assets' },
    { code: '201002', name: 'State Bank of India', type: 'Asset', parent: 'Bank Accounts' },
    { code: '401001', name: 'Room Service Revenue', type: 'Income', parent: 'Operating Revenue' }
  ];
}