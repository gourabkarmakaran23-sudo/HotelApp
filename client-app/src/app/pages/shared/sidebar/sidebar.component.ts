import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { filter, Subscription } from 'rxjs';

interface MenuItem {
  icon: string;
  label: string;
  active?: boolean;
  route?: string;
  open?: boolean;
  children?: SubMenuItem[];
}

interface SubMenuItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', active: true, route: '/dashboard' },
    { icon: '�', label: 'Portfolio Overview', route: '/dashboard2' },
    { icon: '🏢', label: 'Companies', route: '/companies' },
    { icon: '🏨', label: 'Hotels', route: '/hotels' },
    { icon: '🔐', label: 'Menu Rights', route: '/admin/menu-rights' },
    {
      icon: '👤',
      label: 'Account',
      children: [
        { label: 'Agent Commissions', route: '/agent-commissions' },
        { label: 'Commission Agents', route: '/commission-agents' },
        { label: 'Financial Years', route: '/financial-years' },
        { label: 'Financial Year Ending', route: '/account/financial-year-end' },
        { label: 'Chart of Account', route: '/account/chart-of-accounts' },
        { label: 'Opening Balance', route: '/account/opening-balance' },
        { label: 'Debit Voucher', route: '/account/debit-voucher' },
        { label: 'Credit Voucher', route: '/account/credit-voucher' },
        { label: 'Contra Voucher', route: '/account/contra-voucher' },
        { label: 'Journal Voucher', route: '/account/journal-voucher' },
        { label: 'Voucher Approval', route: '/account/voucher-approval' },
        { label: 'Voucher Report', route: '/account/voucher-report' },
        { label: 'Cash Book', route: '/account/cash-book' },
        { label: 'Bank Book', route: '/account/bank-book' },
        { label: 'General Ledger', route: '/account/general-ledger' },
        { label: 'Trial Balance', route: '/account/trial-balance' },
        { label: 'Profit & Loss', route: '/account/profit-loss' },
        { label: 'Balance Sheet', route: '/account/balance-sheet' }
      ]
    },
    {
      icon: '⚙️', label: 'Masters', open: false, children: [
        { label: 'Currency', route: '/currencies' },
        { label: 'Payment Methods', route: '/payment-methods' },
        { label: 'Commission Agents', route: '/commission-agents' },
        { label: 'Agent Commissions', route: '/agent-commissions' },
        { label: 'Financial Years', route: '/financial-years' },
        { label: 'Wake Up Calls', route: '/wake-up-calls' },
        { label: 'Purchase Items', route: '/purchase' },
        { label: 'Purchase Returns', route: '/purchase-returns' },
        { label: 'Stock Report', route: '/stock-report' },
        { label: 'Stock Details', route: '/stock-details' },
        { label: 'Tax List Config', route: '/tax/list' },
        { label: 'Promocode Matrix', route: '/promos/list' }
      ]
    },
    { icon: '🛏️', label: 'Room Types', route: '/room-types' },
    { icon: '🛏️', label: 'Rooms', route: '/rooms' },
    { icon: '💳', label: 'Payment Setting', route: '/payment' },
    {
      icon: '📅',
      label: 'Room Reservation',
      open: false,
      children: [
        { label: 'Booking List', route: '/booking-list' },
        { label: 'Upcoming CheckIn', route: '/upcoming-checkin' },
        { label: 'Check In', route: '/checkin' },
        { label: 'Direct Checkout', route: '/direct-checkout' },
        { label: 'Room Status', route: '/room-status' },
        { label: 'Booking Engine', route: '/booking-engine' }
      ]
    },
    {
      icon: '🛏️',
      label: 'Room Settings',
      children: [
        { label: 'Booking Type', route: '/booking-type' },
        { label: 'Booking Source', route: '/booking-source' },
        { label: 'Bed Type', route: '/bed-type' },
        { label: 'Floor Plan', route: '/floor-plan' },
        { label: 'Complementary', route: '/complementary' },
        { label: 'Amenities Management', route: '/amenities' },
        { label: 'Cancellation Policy', route: '/cancellation-policy' }
      ]
    },
    {
      icon: '📈',
      label: 'Reports Panel',
      open: false,
      children: [
        { label: 'Booking Report', route: '/reports/booking' },
        { label: 'Monthly Summary Report', route: '/reports/monthly_summary' },
        { label: 'Revenue Report', route: '/reports/revenue' },
        { label: 'Transaction Report', route: '/reports/transaction_rep' },
        { label: 'Payment Details Report', route: '/reports/payment_det' },
        { label: 'Payment Summary Report', route: '/reports/payment_sum' },
        { label: 'Daily Room Occupancy', route: '/reports/daily_occupancy' },
        { label: 'Available Room Report', route: '/reports/available_rooms' },
        { label: 'Room Checkout Report', route: '/reports/checkout_rep' },
        { label: 'Today\'s Occupancy', route: '/reports/today_occupancy' },
        { label: 'Meal Details Report', route: '/reports/meal_alt' }
      ]
    },
    {
      icon: '🔖',
      label: 'House Keeping',
      children: [
        { label: 'Assign Room Cleaning', route: '/housekeeping/assign-room-cleaning' },
        { label: 'Room Cleaning', route: '/housekeeping/room-cleaning' },
        { label: 'Checklist', route: '/housekeeping/checklist' },
        { label: 'Laundry', route: '/housekeeping/laundry' },
        { label: 'Laundry Payment', route: '/housekeeping/payment-record' }
      ]
    },
    {
      icon: '💸',
      label: 'Other Payments',
      children: [
        { label: 'Other Payment List', route: '/payment/other-list' },
        { label: 'Other Payment Entry', route: '/payment/other-entry' }
      ]
    }
  ];

  private readonly allMenuItems = this.menuItems;
  private navigationSubscription?: Subscription;

  constructor(private readonly router: Router, private readonly authService: AuthService) { }

  ngOnInit(): void {
    this.refreshMenuItems();
    this.navigationSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.refreshMenuItems());
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }

  private refreshMenuItems(): void {
    this.menuItems = this.allMenuItems
      .map(item => ({
        ...item,
        children: item.children?.filter(child => this.authService.canAccessRoute(child.route))
      }))
      .filter(item => item.route
        ? this.authService.canAccessRoute(item.route)
        : (item.children?.length ?? 0) > 0);

    const currentUrl = this.router.url;
    this.menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(c => currentUrl.startsWith(c.route));
        if (hasActiveChild) {
          item.open = true;
          item.active = true;
        }
      } else if (item.route && currentUrl.startsWith(item.route)) {
        item.active = true;
      }
    });
  }

  onMenuItemClick(item: MenuItem): void {
    if (item.children && item.children.length) {
      item.open = !item.open;
      return;
    }
    this.menuItems.forEach(m => (m.active = false));
    item.active = true;
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  // HTML টেমপ্লেটের [class.sub-active]="isSubActive(sub.route)" এরর ফিক্স করার জন্য মেথড
  isSubActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  // HTML টেমপ্লেটের (click)="onSubMenuClick(item, sub)" এরর ফিক্স করার জন্য মেথড
  onSubMenuClick(parentItem: MenuItem, subItem: SubMenuItem): void {
    this.menuItems.forEach(m => (m.active = false));
    parentItem.active = true; // প্যারেন্ট মেনুকেও অ্যাক্টিভ স্টেট দেবে
    this.router.navigate([subItem.route]);
  }
}