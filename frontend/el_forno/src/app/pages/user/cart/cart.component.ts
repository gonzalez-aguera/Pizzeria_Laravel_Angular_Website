import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OrderService } from 'src/app/services/order/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  apiUrl= 'http://127.0.0.1:8000/api/carts/';
  pedidos: any[] = [];
  totalPrice: number = 0;
  order: any[] = [];
  
  mostrarParaLlevar: boolean = false;
  mostrarRecoger: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.order = this.orderService.getOrder();
    const user = this.authService.getUser();

    if (user) {
      const apiUrlCartUser = `http://127.0.0.1:8000/api/carts/${user}`;
      this.http.get(apiUrlCartUser).subscribe((data: any) => {
        this.pedidos = data.cart;
        this.calculateTotalPrice();
      });
    } else {
      console.log('No hay usuario logueado');
    }
  }

  seleccionarParaLlevar() {
    this.mostrarParaLlevar = true;
    this.mostrarRecoger = false;
  }

  seleccionarRecoger() {
    this.mostrarParaLlevar = false;
    this.mostrarRecoger = true;
  }

  calculateTotalPrice() {
    this.totalPrice = this.order.reduce((total, order) => total + order.totalPrice, 0);
  }  

  eliminarPedido(pedido: any) {
    if (pedido.quantity > 1) {
      pedido.quantity -= 1;
      this.orderService.updateQuantity(pedido);
      this.calculateTotalPrice();
    } else {
      this.orderService.removeProduct(pedido);
      this.order = this.orderService.getOrder();
      this.calculateTotalPrice();
      this.successDeleteProduct();
    }
  }

  finalizarPedido() {
    if (this.order.length === 0) {
      this.errorPedidoVacio();
      return;
    }

    if (this.mostrarParaLlevar == false && this.mostrarRecoger == false) {
      this.errorPedidoBotones();
      return;
    }else{
      for (let i = 0; i < this.order.length; i++) {
        if (this.mostrarParaLlevar === true) {
          this.order[i].order = 'PickUp';
        } else {
          this.order[i].order = 'TakeAway';
        }
      }
    }

    const dateTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const productosParaEnviar = this.order.map(producto => {
      return {
        idCustomer: producto.idCustomer,
        idProduct: producto.idProduct,
        quantity: producto.quantity,
        totalPrice: producto.totalPrice,
        order: producto.order,
        time: dateTime
      };
    });
    
    this.http.post(this.apiUrl, { productos: productosParaEnviar })
      .subscribe(
        () => {
          this.successFinalizarPedido();
          this.http.put(this.apiUrl, {});
        },
        () => 
          this.errorFinalizarPedido(),
        () => {
          this.orderService.clearCart();
          this.order = this.orderService.getOrder();
          this.calculateTotalPrice();
        }
        );
  }

  // SweetAlerts
  errorPedidoVacio() {
    Swal.fire({
      title: 'Error al finalizar el pedido',
      icon: 'error',
      text: 'El carrito está vacío',
      confirmButtonText: 'Ok'
    });
  }

  errorPedidoBotones() {
    Swal.fire({
      title: 'Error al finalizar el pedido',
      icon: 'error',
      text: 'Debes seleccionar si quieres recoger o llevar el pedido',
      confirmButtonText: 'Ok'
    });
  }

  successFinalizarPedido() {
    Swal.fire({
      title: 'Pedido realizado con éxito',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  errorFinalizarPedido() {
    Swal.fire({
      title: 'Error al finalizar el pedido',
      icon: 'error',
      text: 'Hubo un problema al procesar el pedido',
      confirmButtonText: 'Ok'
    });
  }

  successDeleteProduct() {
    Swal.fire({
      title: 'Producto eliminado correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }
}