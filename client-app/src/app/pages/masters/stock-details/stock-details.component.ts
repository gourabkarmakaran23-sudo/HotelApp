import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent implements OnInit {
  currentItemName = '';
  ledgerHistory: any[] = [];
  isLoading = false;
  hasSelection = false; // Flag to trace item context focus state

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['item']) {
        this.currentItemName = params['item'];
        this.hasSelection = true;
        this.loadLedgerDetails(this.currentItemName);
      } else {
        // Safe context initialization flag for standalone direct sidebar click
        this.currentItemName = '';
        this.hasSelection = false;
        this.ledgerHistory = [];
      }
    });
  }

  loadLedgerDetails(itemName: string): void {
    this.isLoading = true;
    this.masterService.getStockDetails(itemName).subscribe({
      next: (data) => {
        this.ledgerHistory = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    // Fixed: Pointing to your correct flat route declaration inside app.routes.ts
    this.router.navigate(['/stock-report']);
  }
}