import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

export interface Room {
  id: number;
  roomNumber: string;
  // floorNumber: number;
  floorNo: number; // Matches backend property name
  roomTypeId: number; // Matches foreign key to RoomTypes entity
  roomType?: any;     // Optional navigation object if included
  capacity: number;
  price: number;
  status: string;
  description?: string;
  hotelId?: number;
}

// Wrapper interface to map the backend PageResultDto structure
export interface PageResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}


// Wrapper interface to map the backend PageResultDto structure
export interface PageResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly baseUrl = `${apiBaseUrl}/room`;

  constructor(private readonly http: HttpClient) {}

  // Accept pagination filters matching FIlterDto
  getAll(pageNumber: number = 1, pageSize: number = 20, searchTerm: string = ''): Observable<PageResult<Room>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PageResult<Room>>(this.baseUrl, { params });
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
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getRoomsByRoomType(roomTypeId: number) {
  return this.http.get<any[]>(
    `${this.baseUrl}/by-roomtype/${roomTypeId}`
  );
}
}