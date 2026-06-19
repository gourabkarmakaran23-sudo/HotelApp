import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasterService } from '../../../services/master.service';

@Component({
  selector: 'app-financial-year',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './financial-year.component.html',
  styleUrls: ['./financial-year.component.scss'] // Share the master clean design CSS file directly!
})
export class FinancialYearComponent implements OnInit {
  financialYears: any[] = [];
  selectedYear: any = this.initEmptyModel();
  isEditMode = false;
  isFormOpen = false;
  isLoading = false;
  errorMessage = '';

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.loadYears();
  }

  loadYears(): void {
    this.isLoading = true;
    this.masterService.getFinancialYears().subscribe({
      next: (data) => { this.financialYears = data; this.isLoading = false; },
      error: () => { this.errorMessage = 'Could not load the financial boundaries system.'; this.isLoading = false; }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedYear = this.initEmptyModel();
    this.isFormOpen = true;
  }

  openEditModal(year: any): void {
    this.isEditMode = true;
    this.selectedYear = { ...year };
    // Date string splitting transformations for pure inputs handling
    if (this.selectedYear.fromDate) this.selectedYear.fromDate = this.selectedYear.fromDate.split('T')[0];
    if (this.selectedYear.toDate) this.selectedYear.toDate = this.selectedYear.toDate.split('T')[0];
    this.isFormOpen = true;
  }

  saveYear(): void {
    if (new Date(this.selectedYear.fromDate) >= new Date(this.selectedYear.toDate)) {
      this.errorMessage = 'Invalid timeline configuration: Start boundary must precede terminal date.';
      return;
    }

    this.isLoading = true;
    const execution$ = this.isEditMode
      ? this.masterService.updateFinancialYear(this.selectedYear.id, this.selectedYear)
      : this.masterService.createFinancialYear(this.selectedYear);

    execution$.subscribe({
      next: () => { this.isFormOpen = false; this.loadYears(); },
      error: () => { this.errorMessage = 'Failed saving configuration schema changes.'; this.isLoading = false; }
    });
  }

  deleteYear(id: number): void {
    if (!confirm('Are you absolutely certain you wish to purge this calendar record model scope?')) return;
    this.isLoading = true;
    this.masterService.deleteFinancialYear(id).subscribe({
      next: () => this.loadYears(),
      error: () => { this.errorMessage = 'Purge target execution aborted by core engine.'; this.isLoading = false; }
    });
  }

  closeForm(): void { this.isFormOpen = false; }
  private initEmptyModel() {
    return { title: '', fromDate: '', toDate: '', isActive: false };
  }
}