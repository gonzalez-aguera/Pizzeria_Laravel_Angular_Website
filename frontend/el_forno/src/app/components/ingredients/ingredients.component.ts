import { Component } from '@angular/core';
import { Ingredient } from 'src/app/models/ingredients.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngredientService } from 'src/app/services/ingredient/ingredient.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss']
})

export class IngredientsComponent {
  ingredientForm: FormGroup;
  ingredients: Ingredient[] = [];

  constructor(private formBuilder: FormBuilder, private ingredientService: IngredientService, private router: Router) {
    this.ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      productType: ['', Validators.required]
    });
  }

  addIngredients() {
    if (this.ingredientForm.valid) {
      const newIngredient = {
        name: this.ingredientForm.value.name,
        productType: this.ingredientForm.value.productType,
      };
  
      this.ingredientService.checkAndAddIngredient(newIngredient).subscribe(
        (response) => {  
          if (response.message === 'Ingredient updated successfully') {
            this.successUpdateIngredient();
          } else {
            this.ingredients = [...this.ingredients, {...this.ingredientForm.value}];
            this.router.navigate(['create-admin']);
            this.successAddIngredient();
          }
        },
        () => {
          this.errorAddIngredient();
        }
      );
    }
  }

  goBack(){
    window.history.back();
  }
  
  //alerts
  successAddIngredient() {
    Swal.fire({
      title: 'Ingrediente añadido correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }
  
  successUpdateIngredient() {
    Swal.fire({
      title: 'Ingrediente actualizado correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }
  
  errorAddIngredient() {
    Swal.fire({
      title: 'Error al añadir/actualizar el ingrediente',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
}
