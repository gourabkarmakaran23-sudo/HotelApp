import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

export interface MenuPermissionOption {
  route: string;
  label: string;
  category: string;
  sortOrder: number;
}

@Injectable({ providedIn: 'root' })
export class MenuPermissionsService {
  private readonly apiUrl = `${apiBaseUrl}/menu-permissions`;

  constructor(private readonly http: HttpClient) {}

  getCurrent(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/current`);
  }

  getCatalog(): Observable<MenuPermissionOption[]> {
    return this.http.get<MenuPermissionOption[]>(`${this.apiUrl}/catalog`);
  }

  getRolePermissions(role: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles/${role}`);
  }

  updateRolePermissions(role: string, routes: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/roles/${role}`, { routes });
  }
}