import { Component, OnInit } from '@angular/core';
import { NgbDropdownModule, NgbNavItem } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [NgbNavModule, RouterModule, NgbDropdownModule, NgbNavItem, CommonModule
  ]
})

export class NavbarComponent implements OnInit{

  customerRole: string = '';
  token: string = '';
  userId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const storedCustomerRole = localStorage.getItem('customerRole');
    if (storedCustomerRole) {
      this.customerRole = storedCustomerRole;
    } else {
      this.authService.getCustomerRole().subscribe((customerRole: string) => {
        this.customerRole = customerRole;
      });
    }

    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
    }

    this.userId = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
  }
}