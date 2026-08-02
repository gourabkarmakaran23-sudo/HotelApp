import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { UserRepositoryService } from './user-repository.service';
import { HotelLookupDto, HotelService } from './hotel.service';
import { HttpClient } from '@angular/common/http';

const storageKey = 'hotel-restaurant-jwt';
const hotelStorageKey = 'hotel-restaurant-active-hotel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly activeHotelSubject = new BehaviorSubject<number | null>(this.getActiveHotelId());
  public activeHotel$ = this.activeHotelSubject.asObservable();

  constructor(private readonly userRepository: UserRepositoryService
    ,private readonly http: HttpClient,
    private readonly hotelService: HotelService
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.userRepository.login(request).pipe(
      tap((response) => {
        this.saveToken(response.token);
        if (response.activeHotelId !== undefined) {
          this.setActiveHotel(response.activeHotelId);
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
    this.activeHotelSubject.next(null);
  }

  saveToken(token: string): void {
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
}