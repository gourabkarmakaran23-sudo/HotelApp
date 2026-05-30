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
   getCheckInList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/checkin-list`);
  }
  getUpcomingCheckIns() {
  return this.http.get<any[]>(
    `${this.baseUrl}/upcoming-checkins`
  );
  
}
getBookingById(id: number) {

  return this.http.get<any>(
    `${this.baseUrl}/${id}`
  );

}
getUpcomingCheckins(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.baseUrl}/upcoming-checkins`
  );
}

checkInBooking(id: number): Observable<any> {
  return this.http.post(
    `${this.baseUrl}/${id}/checkin`,
    {}
  );
}

getBookingForEdit(id: number): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/${id}/edit`
  );
}

}