import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomTypeDto, CreateRoomTypeDto, ApiResponseDto } from '..//models/room-type.model';
import { apiBaseUrl } from '../app.config';

@Injectable({
  providedIn: 'root' // Makes this service globally available in your app
})
export class RoomTypeService {
  private apiUrl = `${apiBaseUrl}/RoomType`; // Update this to match your backend environment URL
  private readonly baseUrl = `${apiBaseUrl}/RoomType`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponseDto<RoomTypeDto[]>> {
    return this.http.get<ApiResponseDto<RoomTypeDto[]>>(this.apiUrl);
  }

  getById(id: number): Observable<ApiResponseDto<RoomTypeDto>> {
    return this.http.get<ApiResponseDto<RoomTypeDto>>(`${this.apiUrl}/${id}`);
  }

  create(roomType: CreateRoomTypeDto): Observable<ApiResponseDto<RoomTypeDto>> {
    return this.http.post<ApiResponseDto<RoomTypeDto>>(this.apiUrl, roomType);
  }
  update(id: number, roomType: CreateRoomTypeDto): Observable<ApiResponseDto<RoomTypeDto>> {
    return this.http.put<ApiResponseDto<RoomTypeDto>>(`${this.apiUrl}/${id}`, roomType);
  }

  delete(id: number): Observable<ApiResponseDto<boolean>> {
    return this.http.delete<ApiResponseDto<boolean>>(`${this.apiUrl}/${id}`);
  }
}