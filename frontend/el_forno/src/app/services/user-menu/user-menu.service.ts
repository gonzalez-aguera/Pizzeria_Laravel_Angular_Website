import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../order/order.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserMenuService {

  private apiUrl = 'http://127.0.0.1:8000/api/products';

  constructor(
    private http: HttpClient,
    private orderService: OrderService
  ) {}

  fetchMenu() {
    return this.http.get<any[]>(this.apiUrl);
  }

  categorizeCards(cards: any[]) {
    const categorizedCards: { [key: string]: any[] } = {};

    for (const card of cards) {
      const type = card.type;
      if (!categorizedCards[type]) {
        categorizedCards[type] = [];
      }
      categorizedCards[type].push(card);
    }
    return categorizedCards;
  }

  getCategories(categorizedCards: { [key: string]: any[] }) {
    return Object.keys(categorizedCards);
  }

  addToCart(card: any) {
    this.orderService.addToCart(card);
    card.quantity = undefined;
  }

  checkAndAddProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, product);
  }
}
