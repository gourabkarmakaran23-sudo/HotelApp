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
    { 
      icon: '👤', 
      label: 'Account', 
      children: [
        { label: 'Opening Balance', route: '/account/opening-balance' }
      ]
    },
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
    //Single Menu
    { icon: '🛏️', label: 'Room Types', route: '/room-types' },
    { icon: '💳', label: 'Payment Setting', route: '/payment' },
    { icon: '🛒', label: 'Purchase Manage', route: '/purchase' },
    { icon: '📈', label: 'Reports', route: '/reports' },
    { icon: '🏨', label: 'Room Facilities', route: '/facilities' },
    { icon: '📦', label: 'Unit and Products', route: '/products' },
    { icon: '🔖', label: 'House Keeping', route: '/housekeeping' },

     //Single Menu
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

    
   
    { 
      icon: '🛏️', 
      label: 'Room Setting', 
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
      icon: '🎫', 
      label: 'Tax Management', 
      children: [
        { label: 'Tax List Config', route: '/tax/list' }
      ]
    },
    { 
      icon: '💰', 
      label: 'Promo/code Management', 
      children: [
        { label: 'Promocode Matrix', route: '/promos/list' }
      ]
    },
    {
      icon: '💸',
      label: 'Other Payments',
      children: [
        { label: 'Other Payment List', route: '/payment/other-list' },
        { label: 'Other Payment Entry', route: '/payment/other-entry' }
      ]
    },
    { 
      icon: '❌', 
      label: 'Cancellation Management', 
      open: false,
      children: [
        { label: 'Refund Due (Non-Website)', route: '/cancellation/refund-due' },
        { label: 'Refund Under Process', route: '/cancellation/refund-process' },
        { label: 'Refunded Archives', route: '/cancellation/refunded-archive' }
      ]
    }
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
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