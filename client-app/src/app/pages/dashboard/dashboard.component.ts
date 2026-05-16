import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { DashboardSummary, OccupancyRow } from '../../models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  occupancyRows: OccupancyRow[] = [
    { room: '401 (FNV)', status: 'Check Out | Check In', badge: 'today' },
    { room: '501 (PV)', status: 'Occupied', badge: 'occupied' },
    { room: '503 (ENV)', status: 'Occupied', badge: 'occupied' },
    { room: '602 (NV)', status: 'Check In', badge: 'checkin' }
  ];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe((summary) => {
      this.summary = summary;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
