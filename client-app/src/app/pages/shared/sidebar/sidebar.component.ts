import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

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
export class SidebarComponent implements OnInit {

  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', active: true, route: '/dashboard' },
    { icon: '📋', label: 'Tariff Interface', route: '/tariff' },
    { icon: '👤', label: 'Account', route: '/account' },
    { icon: '🛏️', label: 'Room Types', route: '/room-types' },
    { icon: '🛏️', label: 'Rooms', route: '/rooms' },
    { icon: '💳', label: 'Payment Setting', route: '/payment' },
    { icon: '🛒', label: 'Purchase Manage', route: '/purchase' },
    { icon: '📈', label: 'Reports', route: '/reports' },
    { icon: '🏨', label: 'Room Facilities', route: '/facilities' },
    //Add master pages here like Room Rerrvation and submenu
    {icon: '⚙️', label: 'Masters', open: false, children: [
      { label: 'Currency', route: '/currencies' },
      { label: 'Payment Methods', route: '/payment-methods' },
      { label: 'Commission Agents', route: '/commission-agents' },
      { label: 'Agent Commissions', route: '/agent-commissions' },
      { label: 'Financial Years', route: '/financial-years' },
      { label: 'Wake Up Calls', route: '/wake-up-calls' },
      { label: 'Purchase Items', route: '/purchase' },
      { label: 'Purchase Returns', route: '/purchase-returns' },
      { label: 'Stock Report', route: '/stock-report' },
      { label: 'Stock Details', route: '/stock-details' }
      //Add more master pages here
    ]},
    //#region Room Settings Sub Pages
    {icon: '🛏️', label: 'Room Settings', open: false, children: [
      { label: 'Booking Type', route: '/booking-type' },
      { label: 'Booking Source', route: '/booking-source' },
      { label: 'Bed Type', route: '/bed-type' }
    ]},
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
    { icon: '📦', label: 'Unit and Products', route: '/products' },
    { icon: '🔖', label: 'House Keeping', route: '/housekeeping' },
    { icon: '🛏️', label: 'Room Setting', route: '/room-settings' },
    { icon: '🎫', label: 'Tax Management', route: '/tax' },
    { icon: '💰', label: 'Promo/code Management', route: '/promos' }
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    // Auto-expand the parent group whose child matches the current route
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

  onSubMenuClick(parent: MenuItem, sub: SubMenuItem): void {
    this.menuItems.forEach(m => (m.active = false));
    parent.active = true;
    parent.open = true;
    if (sub.route) {
      this.router.navigate([sub.route]);
    }
  }

  isSubActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
