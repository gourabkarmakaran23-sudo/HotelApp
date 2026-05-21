import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config'; // Adjust this import location based on your app architecture

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  capacity: number;
  price: number;
  status: string;
  description?: string;
  hotelId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly baseUrl = `${apiBaseUrl}/room`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters?: any): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl, { params: filters });
  }

  getById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.baseUrl}/${id}`);
  }

  create(room: Omit<Room, 'id'>): Observable<Room> {
    return this.http.post<Room>(this.baseUrl, room);
  }

  update(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.baseUrl}/${id}`, room);
  }
}