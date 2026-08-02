import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';


export interface HotelLookupDto {
  id: number;
  name: string;
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
  private readonly apiUrl = `${apiBaseUrl}/api/hotels`;

  constructor(private readonly http: HttpClient) {}

  getLookup(): Observable<HotelLookupDto[]> {
    return this.http.get<HotelLookupDto[]>(`${this.apiUrl}/lookup`);
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