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
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-guest',
    component: AddGuestComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'guest-details',
  //   component: GuestDetailsComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'payment-list',
  //   component: PaymentListComponent,
  //   canActivate: [AuthGuard]
  // },
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
  {
    path: 'upcoming-checkin',
    component: UpcomingCheckinComponent,
    canActivate: [AuthGuard]
  },
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
  
  // { path: 'tariff', loadComponent: () => import('./pages/masters/tariff/tariff.component').then(m => m.TariffComponent), canActivate: [AuthGuard] },
  // { path: 'room-types', loadComponent: () => import('./pages/masters/room-types/room-types.component').then(m => m.RoomTypesComponent), canActivate: [AuthGuard] },
  // { path: 'rooms', loadComponent: () => import('./pages/masters/rooms/rooms.component').then(m => m.RoomsComponent), canActivate: [AuthGuard] },
  // { path: 'payment', loadComponent: () => import('./pages/masters/payment-settings/payment-settings.component').then(m => m.PaymentSettingsComponent), canActivate: [AuthGuard] },
  // { path: 'purchase', loadComponent: () => import('./pages/masters/purchase-manage/purchase-manage.component').then(m => m.PurchaseManageComponent), canActivate: [AuthGuard] },
  // { path: 'reports', loadComponent: () => import('./pages/masters/reports/reports.component').then(m => m.ReportsComponent), canActivate: [AuthGuard] },
  // { path: 'masters', loadComponent: () => import('./pages/masters/masters/masters.component').then(m => m.MastersComponent), canActivate: [AuthGuard] },
  // { path: 'housekeeping', loadComponent: () => import('./pages/masters/house-keeping/house-keeping.component').then(m => m.HouseKeepingComponent), canActivate: [AuthGuard] },
  
  {path: 'room-types', loadComponent: () => import('./pages/room-type/room-type.component').then(m => m.RoomTypeComponent), canActivate: [AuthGuard] }, 
  { path: 'rooms',      loadComponent: () => import('./pages/rooms/room.component').then(m => m.RoomComponent), canActivate: [AuthGuard] },

  { path: 'stock-details', loadComponent: () => import('./pages/masters/stock-details/stock-details.component').then(m => m.StockDetailsComponent), canActivate: [AuthGuard] },
  
  //#region Room Settings Sub Pages
  { path: 'booking-type', loadComponent: () => import('./pages/room-settings/booking-type/booking-type.component').then(m => m.BookingTypeComponent), canActivate: [AuthGuard] },
  { path: 'booking-source', loadComponent: () => import('./pages/room-settings/booking-source/booking-source.component').then(m => m.BookingSourceComponent), canActivate: [AuthGuard] },
  { path: 'bed-type', loadComponent: () => import('./pages/room-settings/bed-type/bed-type.component').then(m => m.BedTypeComponent), canActivate: [AuthGuard] },
  { path: 'floor-plan', loadComponent: () => import('./pages/room-settings/floor-plan/floor-plan.component').then(m => m.FloorPlanComponent), canActivate: [AuthGuard] },
  { path: 'complementary', loadComponent: () => import('./pages/room-settings/complementary/complementary.component').then(m => m.ComplementaryComponent), canActivate: [AuthGuard] },
  { path: 'amenities', loadComponent: () => import('./pages/room-settings/amenities/amenity.component').then(m => m.AmenitiesComponent), canActivate: [AuthGuard] },
  { path: 'cancellation-policy', loadComponent: () => import('./pages/room-settings/cancellation-policy/cancellation-policy.component').then(m => m.CancellationPolicyComponent), canActivate: [AuthGuard] },
  //#endregion

  //#region Account & Tax / Promocode Management
  { path: 'account/opening-balance', loadComponent: () => import('./pages/accounts/opening-balance/opening-balance.component').then(m => m.OpeningBalanceComponent), canActivate: [AuthGuard] },
  { path: 'tax/list', loadComponent: () => import('./pages/masters/tax/tax.component').then(m => m.TaxComponent), canActivate: [AuthGuard] },
  { path: 'promos/list', loadComponent: () => import('./pages/masters/promocode/promocode.component').then(m => m.PromocodeComponent), canActivate: [AuthGuard] },
  //#endregion

//#region Other Payment Management
  { 
    path: 'payment/other-list', 
    loadComponent: () => import('./pages/payments/other-payment-list/other-payment-list.component').then(m => m.OtherPaymentListComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'payment/other-entry', 
    loadComponent: () => import('./pages/payments/other-payment-entry/other-payment-entry.component').then(m => m.OtherPaymentEntryComponent), 
    canActivate: [AuthGuard] 
  }
  //#endregion
];