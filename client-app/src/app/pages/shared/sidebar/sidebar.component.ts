import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuPermissionOption, MenuPermissionsService } from '../../../services/menu-permissions.service';
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
  menuItems: MenuItem[] = [];
  menuError = '';
  private navigationSubscription?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly menuPermissions: MenuPermissionsService
  ) { }

  ngOnInit(): void {
    this.loadMenuItems();
    this.navigationSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.refreshActiveItem());
  }

  ngOnDestroy(): void {
    this.navigationSubscription?.unsubscribe();
  }

  private loadMenuItems(): void {
    this.menuPermissions.getNavigation().subscribe({
      next: menus => {
        this.menuError = '';
        const groups = new Map<string, MenuPermissionOption[]>();
        for (const menu of menus) {
          const categoryMenus = groups.get(menu.category) ?? [];
          categoryMenus.push(menu);
          groups.set(menu.category, categoryMenus);
        }

        this.menuItems = [...groups].map(([category, categoryMenus]) => {
          if (category === 'General' && categoryMenus.length === 1) {
            return {
              icon: this.iconFor(category),
              label: categoryMenus[0].label,
              route: `/${categoryMenus[0].route}`
            };
          }

          return {
            icon: this.iconFor(category),
            label: category,
            open: false,
            children: categoryMenus.map(menu => ({ label: menu.label, route: `/${menu.route}` }))
          };
        });
        this.refreshActiveItem();
      },
      error: () => {
        this.menuItems = [];
        this.menuError = 'Unable to load menus from the database.';
      }
    });
  }

  private iconFor(category: string): string {
    const icons: Record<string, string> = {
      'General': '📊',
      'Super Admin': '🔐',
      'Reservations': '📅',
      'Reports': '📈',
      'Masters': '⚙️',
      'Room Types': '🛏️',
      'Room Settings': '🛏️',
      'Operations': '🏨',
      'Payments': '💳',
      'Accounting': '👤',
      'Housekeeping': '🔖'
    };
    return icons[category] ?? '•';
  }

  private refreshActiveItem(): void {
    const currentUrl = this.router.url;
    this.menuItems.forEach(item => {
      item.active = false;
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