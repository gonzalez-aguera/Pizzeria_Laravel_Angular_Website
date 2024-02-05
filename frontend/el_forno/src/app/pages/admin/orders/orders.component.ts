import { Component,OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit{
  orders: any[] = [];
  filteredOrders: any[] = [];
  orderDetails: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((data: any[]) => {
      this.orders = data;
      this.checkValues();
    });
  }

  private getUniqueOrders(): any[] {
    const seen = new Set<string>();
    return this.orders.filter((order) => {
      const key = `${order.idCustomer}-${order.date}-${order.time}`;
      if (!seen.has(key)) {
        seen.add(key);
        return true;
      }
      return false;
    });
  }

  showOrders(order: any) {
    this.orderDetails = this.orders.filter((o) => {
      return o.idCustomer === order.idCustomer && o.date === order.date && o.time === order.time;
    });
  }

  closeDetails() {
    this.orderDetails = [];
  }

  checkValues() {
    this.filteredOrders = this.getUniqueOrders();
  }

  deleteOrder(order: any) {
    const idCartToDelete = order.idCart; 

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deletedCartById(idCartToDelete).subscribe(
          () => {
            this.orders = this.orders.filter(o => o.idCart !== idCartToDelete);
            this.checkValues();
          },
          () => console.error('Error al marcar como eliminado:')
        );
      }
    });
  }
}