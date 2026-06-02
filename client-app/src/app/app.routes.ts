import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BookingListComponent } from './pages/booking-list/booking-list.component';
import { BookingEngineComponent } from './pages/booking-engine/booking-engine.component';
import { CheckinComponent } from './pages/checkin/checkin.component';
import { AddGuestComponent } from './pages/add-guest/add-guest.component';
import { GuestDetailsComponent } from './pages/guest-details/guest-details.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { UpcomingCheckinComponent } from './pages/upcoming-checkin/upcoming-checkin.component';
import { PaymentListComponent } from './pages/payment-list/payment-list.component';
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
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    component: PaymentListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-list/:id',
    component: PaymentListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'guest/:id',
    component: GuestDetailsComponent,
    canActivate: [AuthGuard]
  },
  {path: 'room-types', loadComponent: () => import('./pages/room-type/room-type.component').then(m => m.RoomTypeComponent), canActivate: [AuthGuard] }, 
  { path: 'rooms',      loadComponent: () => import('./pages/rooms/room.component').then(m => m.RoomComponent), canActivate: [AuthGuard] },
{
  path: 'upcoming-checkin',
  loadComponent: () =>
    import('./pages/upcoming-checkin/upcoming-checkin.component')
      .then(m => m.UpcomingCheckinComponent)
},
  { path: '**',         redirectTo: 'login' }
];
