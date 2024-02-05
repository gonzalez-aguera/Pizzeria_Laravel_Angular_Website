import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://127.0.0.1:8000/api/carts/';
  private order: any[] = [];
  private localStorageKey = 'cart';

  constructor(private authService: AuthService, private http: HttpClient) {
    this.loadCartFromLocalStorage();
  }

  addToCart(card: any) {
    const userId = this.authService.getUser();

    if (card.quantity <= 0) {
      this.showErrorQuantityMessage();
      return;
    }

    const userCart = this.order.filter((product) => product.idCustomer === userId);
    const existingProductIndex = userCart.findIndex((product) => product.idProduct === card.idProduct);

    if (existingProductIndex !== -1) {
      const cantidadAnterior = userCart[existingProductIndex].quantity;
      const newQuantity = cantidadAnterior + card.quantity;

      userCart[existingProductIndex] = {
        ...userCart[existingProductIndex],
        quantity: newQuantity,
        totalPrice: card.price * newQuantity,
      };

      this.showSuccessMessage();
    } else {
      if (card.quantity < 0) {
        this.showErrorQuantityMessage()
      }else{
        userCart.push({
          ...card,
          quantity : card.quantity || 1,
          totalPrice: (card.price * card.quantity) || card.price,
          idCustomer: userId
        });
      }
      this.showSuccessMessage();
    }
    this.order = this.order.filter((product) => product.idCustomer !== userId).concat(userCart);
    this.saveCartToLocalStorage();
  }

  getOrder() {
    const userId = this.authService.getUser();
    return this.order.filter((product) => product.idCustomer === userId);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  private saveCartToLocalStorage() {
    localStorage.setItem(this.getCartKey(), JSON.stringify(this.order));
  }

  private getCartKey() {
    const userId = this.authService.getUser();
    return `${this.localStorageKey}_${userId}`;
  }

  private loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem(this.getCartKey());
    if (storedCart) {
      this.order = JSON.parse(storedCart);
    }
  }

  updateQuantity(product: any) {
    const userId = this.authService.getUser();
    const userCart = this.order.filter((p) => p.idCustomer === userId);
    const existingProductIndex = userCart.findIndex((p) => p.idProduct === product.idProduct);

    if (existingProductIndex !== -1) {
      if (product.name.toLowerCase().includes('personalizada')) {
        userCart[existingProductIndex].quantity += 1;
        userCart[existingProductIndex].totalPrice = product.price * userCart[existingProductIndex].quantity;
      } else {
        const newQuantity = Math.max(0, userCart[existingProductIndex].quantity);
        userCart[existingProductIndex].quantity = newQuantity;
        userCart[existingProductIndex].totalPrice = product.price * newQuantity;
      }
      this.showSuccessMessage();
    }

    this.order = this.order.filter((p) => p.idCustomer !== userId).concat(userCart);
    this.saveCartToLocalStorage();
  }

  removeProduct(product: any) {
    const userId = this.authService.getUser();
    this.order = this.order.filter((p) => !(p.idCustomer === userId && p.idProduct === product.idProduct));
    this.saveCartToLocalStorage();
  }

  clearCart() {
    localStorage.removeItem(this.getCartKey());
    this.order = [];
  }

  deletedCartById(idCart: number) {
    const url = `${this.apiUrl}${idCart}`; 
    return this.http.delete(url);
  }

  // SweetAlerts
  showErrorQuantityMessage() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La cantidad debe ser mayor que 0',
    });
  }

  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Producto añadido al carrito',
    });
  }
  
}
