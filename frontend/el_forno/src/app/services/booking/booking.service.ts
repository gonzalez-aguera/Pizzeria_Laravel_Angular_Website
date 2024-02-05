import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/models/reservation.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = 'http://127.0.0.1:8000/api/bookings';

  constructor(private http: HttpClient) {}

  fetchReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl)
  }

  addReservation(reservation: Reservation): Observable<any> {
    return this.http.post(this.apiUrl, reservation)
  }

  deleteReservation(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  updateReservation(reservation: Reservation): Observable<any> {
    const url = `${this.apiUrl}/${reservation.idBooking}`;
    return this.http.put<any>(url, reservation);
  }

  getReservationById(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }
}
