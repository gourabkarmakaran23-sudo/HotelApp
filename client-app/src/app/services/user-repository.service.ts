import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';

export interface UserListItem {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  role: string;
  companyName: string;
  hotelName: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService {
  private readonly baseUrl = `${apiBaseUrl}/auth`;

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request);
  }

  

  createUser(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create-user`, request);
  }

  getUsers(): Observable<UserListItem[]> {
    return this.http.get<UserListItem[]>(`${this.baseUrl}/users`);
  }
}
