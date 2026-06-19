import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-stock-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css']
})
export class StockReportComponent implements OnInit {
  reportData: any[] = [];
  isLoading = false;

  constructor(private masterService: MasterService, private router: Router) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.isLoading = true;
    this.masterService.getStockReport().subscribe({
      next: (data) => {
        this.reportData = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  countLowStock(): number {
    return this.reportData.filter(x => x.status === 'Low Stock').length;
  }

  countOutOfStock(): number {
    return this.reportData.filter(x => x.status === 'Out of Stock').length;
  }

  navigateToDetails(itemName: string): void {
    // Navigate passing name parameters dynamically via router state mappings keys
    this.router.navigate(['/admin/stock-details'], { queryParams: { item: itemName } });
  }
}