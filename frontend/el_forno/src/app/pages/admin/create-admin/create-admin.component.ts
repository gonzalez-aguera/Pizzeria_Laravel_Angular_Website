import { Component } from '@angular/core';
import { Ingredient } from 'src/app/models/ingredients.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent {

  ingredients: Ingredient[] = [];
  pizzas: Ingredient[] = [];
  papas: Ingredient[] = [];
  deletedIngredients: Ingredient[] = [];

  constructor(private ingredientService: IngredientService,private router: Router) {}

  ngOnInit(): void {
    this.fetchIngredients();
  }

  fetchIngredients() {
    this.ingredientService.getIngredients().subscribe((data: any) => {
      this.ingredients = data;
      this.pizzas = this.filterIngredientsByType('Pizza');
      this.papas = this.filterIngredientsByType('Papa');
    });
  }

  deleteIngredient(id: number) {
    this.confirmDelete(id);
  }

  filterIngredientsByType(type: string): Ingredient[] {
    return this.ingredients.filter((ingrediente) => ingrediente.productType === type && !ingrediente.isDeleted);
  }

  successDelete(id: number) {
    const deletedIngredient = this.ingredients.find(ingredient => ingredient.idIngredient === id);

    if (deletedIngredient) {
      this.deletedIngredients.push(deletedIngredient);

      this.pizzas = this.filterIngredientsByType('Pizza');
      this.papas = this.filterIngredientsByType('Papa');

      this.fetchIngredients();

      this.successDeleteIngredient();
    } else {
      this.errorFindIngredientById();
    }
  }

  routeAddIngredient() {
    this.router.navigate(['ingredient']);
  }

  confirmDelete(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez eliminado, no podrás recuperar este ingrediente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ingredientService.deleteIngredient(id).subscribe(
          () => this.successDelete(id),
          () => this.errorDelete()
        );
      }
    });
  }

  // SweetAlerts
  successDeleteIngredient() {
    Swal.fire({
      title: 'Producto eliminado correctamente',
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

  errorFindIngredientById() {
    Swal.fire({
      title: 'Error al encontrar el ingrediente',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
}