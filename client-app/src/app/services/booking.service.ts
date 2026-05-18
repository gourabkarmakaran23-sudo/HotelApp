import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  // Update port destination to match your backend web environment launchSettings.json (e.g. 5000, 5173, etc.)
 // private readonly apiUrl = 'http://localhost:5000/api/bookings'; 
   private readonly baseUrl = `${apiBaseUrl}/bookings`;
  constructor(private readonly http: HttpClient) {}

  createReservation(bookingFormPayload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, bookingFormPayload);
  }
}