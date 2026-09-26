import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CompanyLookupDto, CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="company-switcher" *ngIf="isSuperAdmin">
      <label for="activeCompany">Company:</label>
      <select [value]="activeCompanyId ?? 0" (change)="onCompanyChange($event)">
        <option [value]="0">🏢 All Companies</option>
        <option *ngFor="let company of companies" [value]="company.id">
          🏬 {{ company.name }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    .company-switcher {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #dfe7ff;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 0.35rem 0.6rem;
    }

    label {
      font-weight: 600;
      color: #dfe7ff;
    }

    select {
      background: #111827;
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      padding: 0.3rem 0.5rem;
      min-width: 160px;
    }
  `]
})
export class CompanySwitcherComponent implements OnInit {
  isSuperAdmin = false;
  activeCompanyId: number | null = null;
  companies: CompanyLookupDto[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.hasRole('SuperAdmin');
    this.activeCompanyId = this.authService.getActiveCompanyId();

    if (this.isSuperAdmin) {
      this.companyService.getLookup().subscribe({
        next: (companies) => this.companies = companies,
        error: () => this.companies = []
      });
    }
  }

  onCompanyChange(event: Event): void {
    const selectedValue = Number((event.target as HTMLSelectElement).value);
    const companyId = selectedValue === 0 ? null : selectedValue;
    this.authService.setActiveCompany(companyId);
    window.location.reload();
  }
}
