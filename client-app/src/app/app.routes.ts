import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BookingListComponent } from './pages/booking-list/booking-list.component';
import { BookingEngineComponent } from './pages/booking-engine/booking-engine.component';
import { CheckinComponent } from './pages/checkin/checkin.component';
import { AddGuestComponent } from './pages/add-guest/add-guest.component';
import { GuestDetailsComponent } from './pages/guest-details/guest-details.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login',      component: LoginComponent },
  { path: 'register',   component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-list',
    component: BookingListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'booking-engine',
    component: BookingEngineComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkin',
    component: CheckinComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-guest',
    component: AddGuestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'guest/:id',
    component: GuestDetailsComponent,
    canActivate: [AuthGuard]
  },
  { path: '**',         redirectTo: 'login' }
];
