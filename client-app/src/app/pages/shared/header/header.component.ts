import { Component, OnInit, OnDestroy, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { HotelSwitcherComponent } from '../hotel-switcher/hotel-switcher.component';
import { CompanySwitcherComponent } from '../company-switcher/company-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, HotelSwitcherComponent, CompanySwitcherComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidebarToggle = new EventEmitter<void>();
  currentTime = '';
  showUserMenu = false;
  private timer: any;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get canViewCompanies(): boolean {
    return this.authService.canAccessRoute('companies');
  }

  get canViewBookings(): boolean {
    return this.authService.canAccessRoute('booking-list');
  }

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  updateTime(): void {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    this.currentTime = `${h}:${m}:${s}`;
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.avatar-wrap')) {
      this.showUserMenu = false;
    }
  }
}
