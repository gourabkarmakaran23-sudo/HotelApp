import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MenuPermissionOption, MenuPermissionsService } from '../../services/menu-permissions.service';

@Component({
  selector: 'app-menu-rights',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="permission-page">
      <header class="page-header">
        <div>
          <h1>Menu Rights</h1>
          <p>Assign which menus each role can access.</p>
        </div>
        <div class="header-actions">
          <a class="create-user" routerLink="/admin/users">User List</a>
          <label class="role-select">
            Role
            <select [ngModel]="selectedRole" (ngModelChange)="selectRole($event)" name="role">
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </label>
          <button class="header-save" type="button" [disabled]="loading || saving" (click)="save()">
            {{ saving ? 'Saving...' : 'Save assignments' }}
          </button>
        </div>
      </header>

      <p class="status" *ngIf="loading">Loading menu assignments...</p>
      <p class="status error" *ngIf="error">{{ error }}</p>
      <p class="status success" *ngIf="message">{{ message }}</p>
      <p class="selection-count" *ngIf="!loading">{{ selectedRoutes.size }} of {{ menus.length }} menus assigned</p>

      <div class="menu-groups" *ngIf="!loading">
        <section class="menu-group" *ngFor="let group of groupedMenus">
          <label class="group-heading">
            <input
              type="checkbox"
              [checked]="isCategoryAssigned(group)"
              [indeterminate]="isCategoryPartiallyAssigned(group)"
              [disabled]="saving || isDashboardCategory(group)"
              (change)="setCategoryAssigned(group, $event)"
            />
            <h2>{{ group.category }}</h2>
          </label>
          <label class="menu-option" *ngFor="let menu of group.menus">
            <input
              type="checkbox"
              [checked]="isAssigned(menu.route)"
              [disabled]="saving || menu.route === 'dashboard'"
              (change)="setAssigned(menu.route, $event)"
            />
            <span>{{ menu.label }}</span>
          </label>
        </section>
      </div>

      <footer class="page-actions">
        <button type="button" [disabled]="loading || saving" (click)="save()">
          {{ saving ? 'Saving...' : 'Save assignments' }}
        </button>
      </footer>
    </section>
  `,
  styles: [`
    .permission-page { min-width: 0; background: #fff; border: 1px solid #e1e5eb; border-radius: 8px; padding: 20px; color: #182335; }
    .page-header { display: flex; align-items: end; justify-content: space-between; gap: 20px; padding-bottom: 16px; border-bottom: 1px solid #e1e5eb; }
    h1 { margin: 0; font-size: 22px; }
    .page-header p { margin: 6px 0 0; color: #687387; }
    .role-select { display: grid; gap: 6px; font-weight: 600; }
    .header-actions { display: flex; align-items: end; gap: 10px; }
    .create-user { padding: 9px 16px; border-radius: 4px; background: #246b45; color: #fff; font-weight: 600; text-decoration: none; white-space: nowrap; }
    select { min-width: 180px; padding: 8px 10px; border: 1px solid #c9d1dd; border-radius: 4px; background: #fff; }
    .selection-count { margin: 14px 0 -6px; color: #687387; font-size: 13px; }
    .menu-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(210px, 100%), 1fr)); gap: 14px; padding: 18px 0; }
    .menu-group { border: 1px solid #e1e5eb; border-radius: 6px; padding: 14px; }
    .group-heading { display: flex; align-items: center; gap: 9px; margin-bottom: 10px; }
    .group-heading input { accent-color: #355ca8; }
    h2 { margin: 0; font-size: 16px; }
    .menu-option { display: flex; align-items: center; gap: 9px; padding: 6px 0; color: #3c485a; }
    .menu-option input { accent-color: #355ca8; }
    .status { margin: 14px 0 0; color: #58657a; }
    .error { color: #a12622; }
    .success { color: #246b45; }
    .page-actions { display: flex; justify-content: end; border-top: 1px solid #e1e5eb; padding-top: 14px; }
    .page-actions button { padding: 9px 16px; border: 0; border-radius: 4px; background: #234c8e; color: #fff; font-weight: 600; cursor: pointer; }
    .header-save { padding: 9px 16px; border: 0; border-radius: 4px; background: #234c8e; color: #fff; font-weight: 600; cursor: pointer; }
    .header-save:disabled { opacity: .55; cursor: default; }
    .page-actions button:disabled { opacity: .55; cursor: default; }
    @media (max-width: 640px) { .page-header { align-items: stretch; flex-direction: column; } .header-actions { align-items: stretch; flex-direction: column; } select { width: 100%; } }
  `]
})
export class MenuRightsComponent implements OnInit {
  selectedRole = 'Admin';
  menus: MenuPermissionOption[] = [];
  groupedMenus: { category: string; menus: MenuPermissionOption[] }[] = [];
  selectedRoutes = new Set<string>();
  loading = true;
  saving = false;
  error = '';
  message = '';

  constructor(private readonly menuPermissions: MenuPermissionsService) {}

  private groupMenus(menus: MenuPermissionOption[]): { category: string; menus: MenuPermissionOption[] }[] {
    const grouped = new Map<string, MenuPermissionOption[]>();
    for (const menu of menus) {
      const entries = grouped.get(menu.category) ?? [];
      entries.push(menu);
      grouped.set(menu.category, entries);
    }
    return [...grouped].map(([category, menus]) => ({ category, menus }));
  }

  ngOnInit(): void {
    this.menuPermissions.getCatalog().subscribe({
      next: menus => {
        this.menus = menus;
        this.groupedMenus = this.groupMenus(menus);
        this.loadRolePermissions();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load the menu catalog.';
      }
    });
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.message = '';
    this.loadRolePermissions();
  }

  isAssigned(route: string): boolean {
    return this.selectedRoutes.has(route);
  }

  isCategoryAssigned(group: { menus: MenuPermissionOption[] }): boolean {
    return group.menus.length > 0 && group.menus.every(menu => this.selectedRoutes.has(menu.route));
  }

  isCategoryPartiallyAssigned(group: { menus: MenuPermissionOption[] }): boolean {
    const assignedCount = group.menus.filter(menu => this.selectedRoutes.has(menu.route)).length;
    return assignedCount > 0 && assignedCount < group.menus.length;
  }

  isDashboardCategory(group: { menus: MenuPermissionOption[] }): boolean {
    return group.menus.length === 1 && group.menus[0].route === 'dashboard';
  }

  setCategoryAssigned(group: { menus: MenuPermissionOption[] }, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const nextRoutes = new Set(this.selectedRoutes);
    for (const menu of group.menus) {
      if (menu.route === 'dashboard') {
        continue;
      }
      if (checked) {
        nextRoutes.add(menu.route);
      } else {
        nextRoutes.delete(menu.route);
      }
    }
    this.selectedRoutes = nextRoutes;
  }

  setAssigned(route: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const nextRoutes = new Set(this.selectedRoutes);
    if (checked) {
      nextRoutes.add(route);
    } else {
      nextRoutes.delete(route);
    }
    this.selectedRoutes = nextRoutes;
  }

  save(): void {
    this.saving = true;
    this.error = '';
    this.message = '';
    this.menuPermissions.updateRolePermissions(this.selectedRole, [...this.selectedRoutes]).subscribe({
      next: () => {
        this.saving = false;
        this.message = `${this.selectedRole} menu assignments saved.`;
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.message ?? 'Unable to save menu assignments.';
      }
    });
  }

  private loadRolePermissions(): void {
    this.loading = true;
    this.error = '';
    this.menuPermissions.getRolePermissions(this.selectedRole).subscribe({
      next: routes => {
        this.selectedRoutes = new Set(routes);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load role menu assignments.';
      }
    });
  }
}