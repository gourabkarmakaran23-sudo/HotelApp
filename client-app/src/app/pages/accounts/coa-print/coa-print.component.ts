import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coa-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coa-print.component.html'
})
export class CoaPrintComponent {
  // Chart of Account Tree representation rendering Image 5
  coaTree = [
    { level: 1, code: '1', name: 'Assets', isGroup: true },
    { level: 2, code: '101', name: 'Non Current Assets', isGroup: true },
    { level: 3, code: '10101', name: 'Furniture & Fixturers', isGroup: true },
    { level: 4, code: '1010101', name: 'Class Room Chair', isGroup: false },
    { level: 4, code: '1010102', name: 'Computer Table', isGroup: false },
    { level: 4, code: '1010103', name: 'File Cabinet', isGroup: false },
    { level: 3, code: '10102', name: 'Office Equipment', isGroup: true },
    { level: 4, code: '1010201', name: 'Printer', isGroup: false },
    { level: 4, code: '1010202', name: 'Photocopy & Fax Machine', isGroup: false }
  ];

  onPrint() { window.print(); }
  onAdd() { console.log('Insert COA Tree Leaf node structural row element'); }
  onEdit(node: any) { console.log('Edit structural parameters', node); }
  onDelete(node: any) { console.log('Remove leaf element context from structural tree topology', node); }
}