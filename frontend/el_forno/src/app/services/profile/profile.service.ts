import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://127.0.0.1:8000/api/customers/';

  constructor(private http: HttpClient) {}

  getUserProfile(userId: number): Observable<User> {
    const apiUrlFetch = `${this.apiUrl}${userId}`;
    return this.http.get<User>(apiUrlFetch);
  }

  updateProfile(userId: number, updatedUser: User): Observable<User> {
    const apiUrlProfile = `${this.apiUrl}${userId}`;
    return this.http.put<User>(apiUrlProfile, updatedUser);
  }}
