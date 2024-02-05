import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  customerRole: string = '';

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  ngOnInit(): void {
    this.authService.getCustomerRole().subscribe((customerRole: string) => {
      this.customerRole = customerRole;
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          this.authService.tokenCustomer(response.token, response.user.customerRole, response.user.idCustomer);
          this.authService.updateCustomerRole(response.user.customerRole);
          this.router.navigate(['home']);

          setTimeout(() => {
            window.location.reload();
          }, 500);

        },
        () => this.errorLogin(),
      );
    }
  }

  errorLogin() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al iniciar sesión, email o contraseña incorrectos.',
    })
  }
  
}