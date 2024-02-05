  import { Injectable } from '@angular/core';
  import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
  import { AuthService } from '../auth/auth.service';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';

  @Injectable({
    providedIn: 'root'
  })
  export class GuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      return this.authService.getCustomerRole().pipe(
        map(userRole => {
          const requiredRole = route.data['requiredRole'];
          if (userRole === requiredRole) {
            return true; 
          } else {
            this.router.navigate(['home']);
            return false;
          }
        })
      );
    }
  }


