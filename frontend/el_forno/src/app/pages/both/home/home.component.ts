import { Component } from '@angular/core';
import { HomeService } from 'src/app/services/home/home.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  products: any[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homeService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}
