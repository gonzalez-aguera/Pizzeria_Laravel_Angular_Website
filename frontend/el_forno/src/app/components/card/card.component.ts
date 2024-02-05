import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Products } from 'src/app/models/products.interface';
import { MenuAdminService } from 'src/app/services/admin-menu/menu-admin.service';
import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent{
  productForm: FormGroup;
  products: Products[] = [];
  isEditing: boolean = false;
  idProduct: number = 0;

  constructor(private router: Router, private formBuilder: FormBuilder, private menuAdminService: MenuAdminService, private route: ActivatedRoute) {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      photo: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', Validators.compose([Validators.required, Validators.min(0.01)])]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      this.idProduct = productId;

      if (productId) {
        this.isEditing = true;
        this.menuAdminService.getProductById(productId).subscribe(
          (response) => {  
            if (response.message === 'Product found') {
              const { name, photo, description, type, price } = response.product;
  
              this.productForm = this.formBuilder.group({
                name: [name, Validators.required],
                photo: [photo, Validators.required],
                description: [description, Validators.required],
                type: [type, Validators.required],
                price: [price, Validators.compose([Validators.required, Validators.min(0.01)])]
              });
            } else {
              this.errorfecthProduct();
            }
          },
          () => {
            this.errorfecthProduct();
          }
        );
      }
    });
  }
  
  editProduct() {  
    const newProduct = {
      ...this.productForm.value,
      idProduct: this.idProduct
    };

    this.menuAdminService.updateProduct(newProduct).subscribe(
      (response) => {
  
        if (response.message === 'Product updated successfully') {
          this.successUpdateProduct();
        } else {
          this.successAddProduct();
        }
  
        this.router.navigate(['menu-admin']);
      },
      () => {
        this.errorAddProduct();
      }
    );
  }

  addProduct() {
    const { name, photo, description, type, price } = this.productForm.value;
  
    this.menuAdminService.checkAndAddProduct({ name, photo, description, type, price }).subscribe(
      (response) => {
  
        if (response.message === 'Product updated successfully') {
          this.successUpdateProduct();
        } else {
          this.successAddProduct();
        }
  
        this.router.navigate(['menu-admin']);
      },
      () => {
        this.errorAddProduct();
      }
    );
  }

  goBack(){
    window.history.back();
  }
  
  //alerts
  successUpdateProduct() {
    Swal.fire({
      title: 'Producto actualizado correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }  

  successAddProduct() {
    Swal.fire({
      title: 'Producto agregado correctamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  errorAddProduct() {  
    Swal.fire({
      title: 'Error al agregar el producto',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  errorfecthProduct() {
    Swal.fire({
      title: 'Error al obtener el producto',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
}
