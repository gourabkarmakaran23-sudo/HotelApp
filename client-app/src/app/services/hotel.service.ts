import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';


export interface HotelLookupDto {
  id: number;
  name: string;
  companyId: number;
}

export interface HotelDto {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  rating: number;
}

export interface CreateHotelDto {
  companyId: number;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly apiUrl = `${apiBaseUrl}/hotels`;

  constructor(private readonly http: HttpClient) {}

  getLookup(companyId?: number): Observable<HotelLookupDto[]> {
    const url = companyId === undefined
      ? `${this.apiUrl}/lookup`
      : `${this.apiUrl}/lookup?companyId=${companyId}`;
    return this.http.get<HotelLookupDto[]>(url);
  }

  getAll(): Observable<HotelDto[]> {
    return this.http.get<HotelDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<HotelDto> {
    return this.http.get<HotelDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateHotelDto): Observable<HotelDto> {
    return this.http.post<HotelDto>(this.apiUrl, dto);
  }
}