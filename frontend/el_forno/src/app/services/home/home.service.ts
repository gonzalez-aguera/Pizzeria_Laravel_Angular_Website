import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private urlMock = 'assets/mocks/productMock.json';

  constructor(private http:HttpClient) { }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.urlMock);
  }
}
