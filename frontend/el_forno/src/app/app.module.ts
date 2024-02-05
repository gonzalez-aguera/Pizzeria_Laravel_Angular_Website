import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/both/home/home.component';
import { MenuComponent } from './pages/user/menu/menu.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/both/login/login.component';
import { RegisterComponent } from './pages/both/register/register.component';
import { ProfileComponent } from './pages/both/profile/profile.component';
import { BookingComponent } from './pages/admin/booking/booking.component';
import { AuthComponent } from './pages/both/auth/auth.component';
import { CreateComponent } from './pages/user/create/create.component';
import { CartComponent } from './pages/user/cart/cart.component';
import { MenuAdminComponent } from './pages/admin/menu-admin/menu-admin.component';
import { CreateAdminComponent } from './pages/admin/create-admin/create-admin.component';
import { IngredientsComponent } from './components/ingredients/ingredients.component';
import { CardComponent } from './components/card/card.component';
import { OrdersComponent } from './pages/admin/orders/orders.component';
import { AdminBookingComponent } from './components/admin-booking/admin-booking/admin-booking.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    BookingComponent,
    AuthComponent,
    CreateComponent,
    CartComponent,
    MenuAdminComponent,
    CreateAdminComponent,
    IngredientsComponent,
    CardComponent,
    OrdersComponent,
    AdminBookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarComponent,
    NgbModule,
    CarouselComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
