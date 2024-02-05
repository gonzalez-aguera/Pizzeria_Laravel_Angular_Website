import { Component, OnInit } from '@angular/core';
import { UserIngredientService } from '../../../services/user-ingredient/user-ingredient.service';
import { Ingredient } from '../../../models/ingredients.interface';
import { MenuAdminService } from '../../../services/admin-menu/menu-admin.service';
import { OrderService } from '../../../services/order/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit{
  ingredientes: Ingredient[] = [];
  pizzas: Ingredient[] = [];
  papas: Ingredient[] = [];
  nombresConcatenados: string = '';

  arraySelectedPizzaIngredients: Ingredient[] = [];
  arraySelectedPapaIngredients: Ingredient[] = [];

  constructor(private userIngredientService: UserIngredientService, private menuAdminService: MenuAdminService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchIngredients();
  }

  fetchIngredients() {
    this.userIngredientService.getIngredients().subscribe((data: Ingredient[]) => {
      this.ingredientes = data.map(ingrediente => ({ ...ingrediente, selected: false }));
      this.pizzas = this.filterIngredientsByType('Pizza');
      this.papas = this.filterIngredientsByType('Papa');
    });
  }

  manejarCambio(ingrediente: Ingredient) {
    ingrediente.selected = !ingrediente.selected;
  }

  agregarAlCarrito(tipo: string) {
    const ingredientesSeleccionados = this.ingredientes.filter(i => i.selected && i.productType === tipo);

    if (tipo === 'Pizza') {
      this.arraySelectedPizzaIngredients = ingredientesSeleccionados;
      this.concatIngredientsNames();
      this.addPizza();
    } else if (tipo === 'Papa') {
      this.arraySelectedPapaIngredients = ingredientesSeleccionados;
      this.concatIngredientsNames();
      this.addPapa();
    }
    this.fetchIngredients();
  }

  concatIngredientsNames() {
    this.nombresConcatenados = this.arraySelectedPizzaIngredients.map(i => i.name).join(', ') || this.arraySelectedPapaIngredients.map(i => i.name).join(', ');
    return this.nombresConcatenados;
  }

  private filterIngredientsByType(type: string): Ingredient[] {
    return this.ingredientes.filter(ingrediente => ingrediente.productType === type);
  }

  addPizza() {
    const numberIngredients = this.arraySelectedPizzaIngredients.length;
    const totalPrice = 6 + numberIngredients * 0.5;
  
    const product = {
      name: 'PizzaPersonalizada (' + this.nombresConcatenados + ')',
      photo: 'imagen1.jpeg',
      description: this.nombresConcatenados,
      isDeleted: true,
      type: 'pizza',
      price: totalPrice,
      quantity: 1,
    };
  
    this.addOrUpdateProduct(product);
    this.resetSelectedIngredients();
  }
  
  addPapa() {
    const numberIngredients = this.arraySelectedPapaIngredients.length;
    const totalPrice = 3 + numberIngredients * 0.5;
  
    const product = {
      name: 'PapaPersonalizada (' + this.nombresConcatenados + ')',
      photo: 'imagen1.jpeg',
      description: this.nombresConcatenados,
      isDeleted: true,
      type: 'roasted potato',
      price: totalPrice,
      quantity: 1,
    };
  
    this.addOrUpdateProduct(product);
    this.resetSelectedIngredients();
  }
  
  resetSelectedIngredients() {
    this.arraySelectedPizzaIngredients = [];
    this.arraySelectedPapaIngredients = [];
    this.nombresConcatenados = '';
  }

  addOrUpdateProduct(product: any) {
    const existingProductIndex = this.orderService.getOrder().findIndex(
      (p) => p.name === product.name
    );
  
    if (existingProductIndex !== -1) {
      this.orderService.updateQuantity({
        ...this.orderService.getOrder()[existingProductIndex],
        quantity: this.orderService.getOrder()[existingProductIndex].quantity + 1
      });
    } else {
      this.menuAdminService.checkAndAddProduct(product).subscribe(
        (createdProduct: any) => {
          this.menuAdminService.getProductIdByName(createdProduct.product.name).subscribe(
            (data: any) => {
              createdProduct.idProduct = data.idProduct;
              this.orderService.addToCart(createdProduct.product);
            },
            () => this.errorIdProduct(), 
          );
        },
        () => this.errorCreateProduct()
      );
    }  
  }

  errorIdProduct() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al obtener el ID del producto',
    });
  }

  errorCreateProduct() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al crear el producto',
    });
  }
}