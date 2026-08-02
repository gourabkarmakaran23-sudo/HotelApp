import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-hotel-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hotel-switcher" *ngIf="isSuperAdmin">
      <label for="activeHotel" style="margin-right: 8px; font-weight: bold;">Property:</label>
      <select [value]="activeHotelId ?? 0" (change)="onHotelChange($event)" style="padding: 4px 8px; border-radius: 4px;">
        <option [value]="0">🏢 All Hotels (Consolidated View)</option>
        <option *ngFor="let hotel of hotels" [value]="hotel.id">
          🏨 {{ hotel.name }}
        </option>
      </select>
    </div>
  `
})
export class HotelSwitcherComponent implements OnInit {
  isSuperAdmin = false;
  activeHotelId: number | null = 0;
  hotels: Array<{ id: number; name: string }> = [];

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.isSuperAdmin = this.authService.hasRole('SuperAdmin');
    this.activeHotelId = this.authService.getActiveHotelId();
  }

  onHotelChange(event: Event): void {
    const selectedValue = Number((event.target as HTMLSelectElement).value);
    this.authService.setActiveHotel(selectedValue === 0 ? null : selectedValue);
    window.location.reload(); // Refreshes page to re-fetch data with the new X-Hotel-Id header
  }
}