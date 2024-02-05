import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/both/home/home.component';
import { MenuComponent } from './pages/user/menu/menu.component';
import { LoginComponent } from './pages/both/login/login.component';
import { RegisterComponent } from './pages/both/register/register.component';
import { ProfileComponent } from './pages/both/profile/profile.component';
import { BookingComponent } from './pages/admin/booking/booking.component';
import { GuardService } from './services/guard/guard.service';
import { AuthComponent } from './pages/both/auth/auth.component';
import { CreateComponent } from './pages/user/create/create.component';
import { CartComponent } from './pages/user/cart/cart.component';
import { MenuAdminComponent } from './pages/admin/menu-admin/menu-admin.component';
import { CreateAdminComponent } from './pages/admin/create-admin/create-admin.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { CardComponent } from './components/card/card.component';
import { OrdersComponent } from './pages/admin/orders/orders.component';
import { AdminBookingComponent } from './components/admin-booking/admin-booking/admin-booking.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'create', component: CreateComponent},
  { path: 'cart', component: CartComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'auth', component: AuthComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  //admin
  { path: 'menu-admin', component: MenuAdminComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
  { path: 'ingredient', component: IngredientsComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
  { path: 'card', component: CardComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
  { path: 'card/:id', component: CardComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
  { path: 'booking', component: BookingComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
  { path: 'reservation', component: AdminBookingComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
  { path: 'reservation/:id', component: AdminBookingComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
  { path: 'create-admin', component: CreateAdminComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
  { path: 'orders', component: OrdersComponent, canActivate: [GuardService],data: { requiredRole: 'Admin' }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }