import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HotelService, HotelLookupDto } from '../../services/hotel.service';

@Component({
  selector: 'app-hotel-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hotel-switcher" *ngIf="isSuperAdmin">
      <label for="activeHotel">Property: </label>
      <select [value]="activeHotelId ?? 0" (change)="onHotelChange($event)">
        <option [value]="0">🏢 All Hotels (Consolidated View)</option>
        <option *ngFor="let hotel of hotels" [value]="hotel.id">
          🏨 {{ hotel.name }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    .hotel-switcher { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
    select { padding: 0.375rem 0.75rem; border-radius: 0.375rem; border: 1px solid #d1d5db; background: #fff; }
  `]
})
export class HotelSwitcherComponent implements OnInit {
  isSuperAdmin = false;
  activeHotelId: number | null = null;
  hotels: HotelLookupDto[] = [];

  constructor(
    private readonly authService: AuthService,
    private readonly hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.hasRole('SuperAdmin');
    this.activeHotelId = this.authService.getActiveHotelId();

    if (this.isSuperAdmin) {
      this.hotelService.getLookup().subscribe(data => this.hotels = data);
    }
  }

  onHotelChange(event: Event): void {
    const selectedValue = Number((event.target as HTMLSelectElement).value);
    this.authService.setActiveHotel(selectedValue === 0 ? null : selectedValue);
    window.location.reload();
  }
}