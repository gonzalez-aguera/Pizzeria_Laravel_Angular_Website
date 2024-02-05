import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserIngredientService {

  private apiUrl = 'http://127.0.0.1:8000/api/ingredients';

  constructor(private http: HttpClient) {}

  getIngredients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
