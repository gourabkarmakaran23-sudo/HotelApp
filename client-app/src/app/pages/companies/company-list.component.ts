import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService, CompanyDto, CreateCompanyDto, CompanyLookupDto } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-shell">
      <header class="page-header">
        <div>
          <p class="eyebrow">Enterprise Setup</p>
          <h1>Companies</h1>
        </div>
        <button class="primary-btn" (click)="toggleForm()">
          {{ showForm ? 'Close' : '+ New Company' }}
        </button>
      </header>

      <section class="panel" *ngIf="showForm">
        <h2>Create Company</h2>
        <form [formGroup]="form" (ngSubmit)="saveCompany()" class="company-form">
          <div class="field-row">
            <div class="field-group">
              <label>Company Name</label>
              <input formControlName="name" placeholder="Azure Group" />
            </div>
            <div class="field-group">
              <label>Registration No.</label>
              <input formControlName="legalRegistrationNumber" placeholder="REG-1001" />
            </div>
          </div>

          <div class="field-row">
            <div class="field-group">
              <label>Phone</label>
              <input formControlName="phone" placeholder="+1 234 567 890" />
            </div>
            <div class="field-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="info@company.com" />
            </div>
          </div>

          <div class="field-group">
            <label>Address</label>
            <input formControlName="address" placeholder="123 Corporate Avenue" />
          </div>

          <div class="field-row">
            <div class="field-group">
              <label>City</label>
              <input formControlName="city" placeholder="Dhaka" />
            </div>
            <div class="field-group">
              <label>Country</label>
              <input formControlName="country" placeholder="Bangladesh" />
            </div>
          </div>

          <div class="actions">
            <button type="submit" class="primary-btn" [disabled]="loading || form.invalid">
              {{ loading ? 'Saving...' : 'Create Company' }}
            </button>
          </div>
        </form>
      </section>

      <section class="panel table-panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let company of companies">
              <td><strong>{{ company.name }}</strong></td>
              <td>{{ company.city }}, {{ company.country }}</td>
              <td>{{ company.phone }}<br>{{ company.email }}</td>
              <td>
                <span class="status-badge active">Active</span>
              </td>
            </tr>
            <tr *ngIf="companies.length === 0">
              <td colspan="4" class="empty-state">No companies registered yet.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `,
  styles: [`
    .page-shell { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; color: #3b82f6; font-size: 0.75rem; font-weight: 700; margin: 0 0 0.25rem; }
    h1 { margin: 0; font-size: 2rem; }
    .primary-btn { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 10px; padding: 0.7rem 1.2rem; font-weight: 600; cursor: pointer; }
    .panel { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 1.25rem; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04); margin-bottom: 1.5rem; }
    .company-form { display: flex; flex-direction: column; gap: 1rem; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .field-group { display: flex; flex-direction: column; gap: 0.45rem; }
    .field-group label { font-weight: 600; color: #374151; }
    .field-group input { padding: 0.7rem 0.8rem; border: 1px solid #d1d5db; border-radius: 10px; font-size: 0.95rem; }
    .actions { display: flex; justify-content: flex-start; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { border-bottom: 1px solid #e5e7eb; padding: 0.9rem 0.75rem; text-align: left; }
    .data-table th { background: #f8fafc; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: #475569; }
    .status-badge { display: inline-flex; padding: 0.3rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
    .status-badge.active { background: #dcfce7; color: #166534; }
    .empty-state { text-align: center; color: #64748b; padding: 2rem; }
  `]
})
export class CompanyListComponent implements OnInit {
  companies: CompanyDto[] = [];
  showForm = false;
  loading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    legalRegistrationNumber: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (data) => this.companies = data,
      error: () => this.companies = []
    });
  }

  saveCompany(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const dto: CreateCompanyDto = {
      name: this.form.value.name ?? '',
      legalRegistrationNumber: this.form.value.legalRegistrationNumber ?? '',
      phone: this.form.value.phone ?? '',
      email: this.form.value.email ?? '',
      address: this.form.value.address ?? '',
      city: this.form.value.city ?? '',
      country: this.form.value.country ?? '',
      isActive: true
    };

    this.companyService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.showForm = false;
        this.form.reset();
        this.loadCompanies();
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
