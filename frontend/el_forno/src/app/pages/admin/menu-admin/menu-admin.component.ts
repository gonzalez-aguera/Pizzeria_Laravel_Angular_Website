import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAdminService } from 'src/app/services/admin-menu/menu-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.scss']
})
export class MenuAdminComponent {
  cards: any[] = [];
  deletedCards: any[] = [];
  idCustomer: number | null = null;
  categorizedCards: { [key: string]: any[] } = {};

  constructor(private menuAdminService: MenuAdminService, private router: Router) {}

  ngOnInit() {
    this.fetchCards();
  }

  fetchCards() {
    this.menuAdminService.getProducts().subscribe(data => {
      this.cards = data;
      this.categorizeCards();
    });
  }

  categorizeCards() {
    this.categorizedCards = {};

    for (const card of this.cards) {
      const type = card.type;

      if (!this.categorizedCards[type]) {
        this.categorizedCards[type] = [];
      }

      this.categorizedCards[type].push(card);
    }
  }

  getCategories() {
    return Object.keys(this.categorizedCards);
  }
  
  editProduct(card: any) {
    const productId = card.idProduct;
    this.router.navigate(['card', productId]);
  }

  deleteCard(card: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar este producto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuAdminService.deleteProduct(card.idProduct).subscribe(
          () => this.successDelete(card),
          () => this.errorDelete()
        );
      }
    });
  }

  successDelete(card: any) {
    this.deletedCards.push(card);
    this.successDeleteProduct();
  }

  showAddForm() {
    this.router.navigate(['card']);
  }

  // SweetAlerts
  successDeleteProduct() {
    Swal.fire({
      title: 'Producto eliminado',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  errorDelete() {
    Swal.fire({
      title: 'Error al eliminar el producto',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
}