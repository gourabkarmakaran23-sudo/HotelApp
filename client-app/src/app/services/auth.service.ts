import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { UserRepositoryService } from './user-repository.service';
import { HotelLookupDto, HotelService } from './hotel.service';
import { HttpClient } from '@angular/common/http';
import { MenuPermissionsService } from './menu-permissions.service';

const storageKey = 'hotel-restaurant-jwt';
const hotelStorageKey = 'hotel-restaurant-active-hotel';
const companyStorageKey = 'hotel-restaurant-active-company';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly activeHotelSubject = new BehaviorSubject<number | null>(this.getActiveHotelId());
  public activeHotel$ = this.activeHotelSubject.asObservable();
  private readonly activeCompanySubject = new BehaviorSubject<number | null>(this.getActiveCompanyId());
  public activeCompany$ = this.activeCompanySubject.asObservable();
  private allowedMenuRoutes: Set<string> | null = null;

  constructor(private readonly userRepository: UserRepositoryService
    ,private readonly http: HttpClient,
    private readonly hotelService: HotelService,
    private readonly menuPermissions: MenuPermissionsService
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.userRepository.login(request).pipe(
      tap((response) => {
        this.saveToken(response.token);
        if (response.activeHotelId !== undefined) {
          this.setActiveHotel(response.activeHotelId);
        }
        if (response.activeCompanyId !== undefined) {
          this.setActiveCompany(response.activeCompanyId);
        }
      })
    );
  }

  register(request: RegisterRequest): Observable<void> {
    return this.userRepository.register(request);
  }

  logout(): void {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(hotelStorageKey);
    localStorage.removeItem(companyStorageKey);
    this.activeHotelSubject.next(null);
    this.activeCompanySubject.next(null);
    this.allowedMenuRoutes = null;
  }

  saveToken(token: string): void {
    this.allowedMenuRoutes = null;
    localStorage.setItem(storageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(storageKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // --- MULTI-HOTEL METHODS ---

  getHotelsList(): Observable<HotelLookupDto[]> {
    return this.hotelService.getLookup();
  }

  setActiveHotel(hotelId: number | null): void {
    if (hotelId === null || hotelId === 0) {
      localStorage.removeItem(hotelStorageKey);
    } else {
      localStorage.setItem(hotelStorageKey, hotelId.toString());
    }
    this.activeHotelSubject.next(hotelId);
  }

  getActiveHotelId(): number | null {
    const id = localStorage.getItem(hotelStorageKey);
    return id ? Number(id) : null;
  }

  setActiveCompany(companyId: number | null): void {
    if (companyId === null || companyId === 0) {
      localStorage.removeItem(companyStorageKey);
    } else {
      localStorage.setItem(companyStorageKey, companyId.toString());
    }
    this.activeCompanySubject.next(companyId);
  }

  getActiveCompanyId(): number | null {
    const id = localStorage.getItem(companyStorageKey);
    return id ? Number(id) : null;
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload['role'];
      
      if (Array.isArray(roles)) {
        return roles.includes(role);
      }
      return roles === role;
    } catch {
      return false;
    }
  }

  ensureMenuPermissionsLoaded(): Observable<boolean> {
    if (this.hasRole('SuperAdmin') || this.allowedMenuRoutes !== null) {
      return of(true);
    }

    return this.menuPermissions.getCurrent().pipe(
      tap(routes => this.allowedMenuRoutes = new Set(routes.map(route => this.normalizeRoute(route)))),
      map(() => true),
      catchError(() => of(false))
    );
  }

  canAccessRoute(route: string): boolean {
    if (this.hasRole('SuperAdmin')) {
      return true;
    }

    if (this.allowedMenuRoutes === null) {
      return false;
    }

    const normalizedRoute = this.normalizeRoute(route);
    return [...this.allowedMenuRoutes].some(allowedRoute => this.routeMatches(allowedRoute, normalizedRoute));
  }

  private normalizeRoute(route: string): string {
    return route.split('?')[0].replace(/^\/+|\/+$/g, '');
  }

  private routeMatches(pattern: string, route: string): boolean {
    const patternParts = pattern.split('/');
    const routeParts = route.split('/');
    return patternParts.length === routeParts.length &&
      patternParts.every((part, index) => part.startsWith(':') || part === routeParts[index]);
  }
}