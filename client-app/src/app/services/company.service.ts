import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

export interface CompanyLookupDto {
  id: number;
  name: string;
  city: string;
  country: string;
}

export interface CompanyDto {
  id: number;
  name: string;
  legalRegistrationNumber: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface CreateCompanyDto {
  name: string;
  legalRegistrationNumber: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly apiUrl = `${apiBaseUrl}/companies`;

  constructor(private readonly http: HttpClient) {}

  getLookup(): Observable<CompanyLookupDto[]> {
    return this.http.get<CompanyLookupDto[]>(`${this.apiUrl}/lookup`);
  }

  getAll(): Observable<CompanyDto[]> {
    return this.http.get<CompanyDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<CompanyDto> {
    return this.http.get<CompanyDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateCompanyDto): Observable<CompanyDto> {
    return this.http.post<CompanyDto>(this.apiUrl, dto);
  }
}
