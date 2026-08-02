import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotelService, HotelDto, CreateHotelDto } from '../../services/hotel.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="hotels-container">
      <header class="page-header">
        <h1>Properties Management</h1>
        <button class="btn-primary" (click)="toggleForm()">
          {{ showForm ? 'Close Form' : '+ Add New Hotel' }}
        </button>
      </header>

      <section *ngIf="showForm" class="form-card">
        <h2>Add New Hotel Property</h2>
        <form [formGroup]="form" (ngSubmit)="saveHotel()">
          <div class="form-row">
            <div class="form-group">
              <label>Hotel Name</label>
              <input formControlName="name" placeholder="Grand Luxe Hotel" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input formControlName="phone" placeholder="+1 234 567 890" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="contact@hotel.com" />
            </div>
            <div class="form-group">
              <label>Rating</label>
              <input type="number" step="0.1" formControlName="rating" placeholder="4.5" />
            </div>
          </div>

          <div class="form-group">
            <label>Address</label>
            <input formControlName="address" placeholder="123 Ocean Drive" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>City</label>
              <input formControlName="city" placeholder="Miami" />
            </div>
            <div class="form-group">
              <label>Country</label>
              <input formControlName="country" placeholder="USA" />
            </div>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading || form.invalid">
            {{ loading ? 'Saving...' : 'Create Hotel' }}
          </button>
        </form>
      </section>

      <section class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Property Name</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let h of hotels">
              <td>#{{ h.id }}</td>
              <td><strong>{{ h.name }}</strong></td>
              <td>{{ h.city }}, {{ h.country }}</td>
              <td>{{ h.phone }} | {{ h.email }}</td>
              <td>⭐ {{ h.rating }}</td>
            </tr>
            <tr *ngIf="hotels.length === 0">
              <td colspan="5" class="empty-state">No hotels registered yet.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `,
  styles: [`
    .hotels-container { padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-primary, .btn-submit { background-color: #2563eb; color: #fff; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none; cursor: pointer; font-weight: 500; }
    .form-card, .table-card { background: #fff; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 1.5rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; }
    .form-group label { font-weight: 500; font-size: 0.875rem; margin-bottom: 0.25rem; }
    .form-group input { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th, .data-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; }
    .data-table th { background-color: #f9fafb; font-weight: 600; }
    .empty-state { text-align: center; color: #6b7280; padding: 2rem; }
  `]
})
export class HotelListComponent implements OnInit {
  hotels: HotelDto[] = [];
  showForm = false;
  loading = false;

  form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rating: [5.0, [Validators.required, Validators.min(1), Validators.max(5)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getAll().subscribe((data) => (this.hotels = data));
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  saveHotel(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const dto = this.form.value as CreateHotelDto;

    this.hotelService.create(dto).subscribe({
      next: () => {
        this.loading = false;
        this.showForm = false;
        this.form.reset({ rating: 5.0 });
        this.loadHotels();
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}