import { Component, OnInit} from '@angular/core';
import { UserMenuService } from 'src/app/services/user-menu/user-menu.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{
  cards: any[] = [];
  idCustomer: number | null = null;
  categorizedCards: { [key: string]: any[] } = {};

  constructor(private menuService: UserMenuService, private authService: AuthService) {}

  ngOnInit() {
    this.idCustomer = this.authService.getUser();

    this.menuService.fetchMenu().subscribe(data => {
      this.cards = data;
      this.categorizedCards = this.menuService.categorizeCards(this.cards);
    });
  }

  getCategories() {
    return this.menuService.getCategories(this.categorizedCards);
  }

  addToCart(card: any) {
    if(card.quantity>=1){
      this.menuService.addToCart(card);
    }else{
      this.errorQuantity();
    }
  }

  errorQuantity(){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La cantidad debe ser mínimo de 1.',
    });
  }
}