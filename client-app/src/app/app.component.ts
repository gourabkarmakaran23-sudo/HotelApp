import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './pages/shared/header/header.component';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { CustomAlertComponent } from './pages/shared/custom-alert/custom-alert.component';
import { SidebarComponent } from './pages/shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CustomAlertComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarOpen = true;

  onSidebarToggle(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
