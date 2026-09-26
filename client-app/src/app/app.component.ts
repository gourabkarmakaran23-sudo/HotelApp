import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './pages/shared/header/header.component';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { CustomAlertComponent } from './pages/shared/custom-alert/custom-alert.component';
import { SidebarComponent } from './pages/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, CustomAlertComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  sidebarOpen = true;
  showShell: boolean;
  private readonly navigationSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
    this.showShell = this.shouldShowShell(router.url);
    this.navigationSubscription = router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.showShell = this.shouldShowShell(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  private shouldShowShell(url: string): boolean {
    const path = url.split(/[?#]/, 1)[0].replace(/\/$/, '');
    return this.authService.isAuthenticated() && path !== '/login' && path !== '/register';
  }

  onSidebarToggle(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
