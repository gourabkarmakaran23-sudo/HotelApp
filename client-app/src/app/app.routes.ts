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
  //Add all Master pages here
  { path: 'currencies', loadComponent: () => import('./pages/masters/currency/currency.component').then(m => m.CurrencyComponent), canActivate: [AuthGuard] },
  { path: 'payment-methods', loadComponent: () => import('./pages/masters/payment-method/payment-method.component').then(m => m.PaymentMethodComponent), canActivate: [AuthGuard] },
  { path: 'commission-agents', loadComponent: () => import('./pages/masters/commission-agent/commission-agent.component').then(m => m.CommissionAgentComponent), canActivate: [AuthGuard] },
  {path: 'agent-commissions', loadComponent: () => import('./pages/masters/agent-commission/agent-commission.component').then(m => m.AgentCommissionComponent), canActivate: [AuthGuard] },
  {path: 'financial-years', loadComponent: () => import('./pages/masters/financial-year/financial-year.component').then(m => m.FinancialYearComponent), canActivate: [AuthGuard] },
  {path: 'wake-up-calls', loadComponent: () => import('./pages/masters/wake-up-call/wake-up-call.component').then(m => m.WakeUpCallComponent), canActivate: [AuthGuard] },
  {path: 'purchase', loadComponent: () => import('./pages/masters/purchase-item/purchase-item.component').then(m => m.PurchaseItemComponent), canActivate: [AuthGuard] },
  {path: 'purchase-returns', loadComponent: () => import('./pages/masters/purchase-return/purchase-return.component').then(m => m.PurchaseReturnComponent), canActivate: [AuthGuard] },
  {path: 'stock-report', loadComponent: () => import('./pages/masters/stock-report/stock-report.component').then(m => m.StockReportComponent), canActivate: [AuthGuard] },
  {path: 'stock-details', loadComponent: () => import('./pages/masters/stock-details/stock-details.component').then(m => m.StockDetailsComponent), canActivate: [AuthGuard] },
  

{
  path: 'upcoming-checkin',
  loadComponent: () =>
    import('./pages/upcoming-checkin/upcoming-checkin.component')
      .then(m => m.UpcomingCheckinComponent)
},
  { path: '**',         redirectTo: 'login' }
];
