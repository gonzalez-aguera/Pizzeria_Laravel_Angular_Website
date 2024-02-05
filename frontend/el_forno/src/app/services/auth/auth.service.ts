import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Sujeto que requiere un valor inicial como argumento.
  private _customerRole: BehaviorSubject<string> = new BehaviorSubject<string>('Customer');
  private apiUrl = 'http://127.0.0.1:8000/api/login';
  private apiUrlRegister = 'http://127.0.0.1:8000/api/register';

  constructor(private http: HttpClient, private router: Router) {
    const storedCustomerRole = localStorage.getItem('customerRole');
    this._customerRole.next(storedCustomerRole || 'Customer');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password })
      .pipe(
        catchError(error => {
          return throwError(error);
        }),        
      );
  }

  logout(): void {
    localStorage.clear();
    setTimeout(() => {
      window.location.reload();
    }, 500);

    this.router.navigate(['home']); 
  }

  tokenCustomer(token: string, customerRole: string, user: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('customerRole', customerRole);
    localStorage.setItem('user', user);
    this._customerRole.next(customerRole);
  }

  getCustomerRole(){ 
    return this._customerRole.asObservable();
  }

  updateCustomerRole(newRole: string) {
    this._customerRole.next(newRole);
    localStorage.setItem('customerRole', newRole);
  }

  getUser(): number | null {
    const userId = localStorage.getItem('user');
    return userId ? +userId : null; // El operador + convierte el string en número
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrlRegister, data)
      .pipe(
        catchError(error => {
          return throwError(error);
        }),
      );
  }
}