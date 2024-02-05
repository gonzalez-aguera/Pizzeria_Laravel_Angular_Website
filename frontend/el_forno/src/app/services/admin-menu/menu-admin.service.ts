import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuAdminService {

  private apiUrl = 'http://127.0.0.1:8000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteProduct(id: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this.http.delete(apiUrl);
  }

  getProductById(id: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this.http.get(apiUrl);
  }
  
  getProductIdByName(name: string): Observable<any> {
    const apiUrl = `${this.apiUrl}?name=${name}`;
    return this.http.get<any[]>(apiUrl);
  }
  

  checkAndAddProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, product);
  }

  updateProduct(product: any): Observable<any> {
    const apiUrl = `${this.apiUrl}/${product.idProduct}`;
    return this.http.put<any>(apiUrl, product);
  }

  checkExistingProductByName(name: string): Observable<any> {
    const apiUrl = `${this.apiUrl}/${name}`;
    return this.http.get<any>(apiUrl);
  }
}
