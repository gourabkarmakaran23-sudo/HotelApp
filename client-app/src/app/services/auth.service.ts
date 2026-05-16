import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { UserRepositoryService } from './user-repository.service';

const storageKey = 'hotel-restaurant-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly userRepository: UserRepositoryService) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.userRepository.login(request).pipe(
      tap((response) => this.saveToken(response.token))
    );
  }

  register(request: RegisterRequest): Observable<void> {
    return this.userRepository.register(request);
  }

  logout(): void {
    localStorage.removeItem(storageKey);
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
}
