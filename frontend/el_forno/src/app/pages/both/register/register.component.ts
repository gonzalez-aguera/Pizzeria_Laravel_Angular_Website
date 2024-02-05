import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required , Validators.pattern('[0-9]{9}')])],
      address: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registerData = {
        ...this.registerForm.value,
        customerRole: 'Customer'
      };

      this.authService.register(registerData).subscribe(
        () => {
          this.authService.login(registerData.email, registerData.password).subscribe(
            (response) => {
              this.authService.tokenCustomer(response.token, response.user.customerRole, response.user.idCustomer);
              this.authService.updateCustomerRole(response.user.customerRole);
              this.router.navigate(['home']);

              setTimeout(() => {
                window.location.reload();
              }, 500);
            },
            () => this.errorLogin()
          );
        },
        () => this.errorRegister()
      );
    }
  }

  errorLogin(){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al iniciar sesion una vez ya registrado.',
    })
  }

  errorRegister() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al registrar al usuario, email o movil ya estan registrados.',
    })
  }
}
