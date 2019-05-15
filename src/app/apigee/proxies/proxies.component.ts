import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-proxies',
  templateUrl: './proxies.component.html',
  styleUrls: ['./proxies.component.scss']
})
export class ProxiesComponent implements OnInit {

  notifier: NotifierSvc;
  allProducts: any = [];
  searchText: string;
  sorted = true;
  jwtDecoded: object = {};

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private fb:FormBuilder) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "orgAdmin") {
      this.getProducts();
    } else {
      this.router.navigate(['/']);
    }
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  getProducts() {
    this.apigee.getProducts().subscribe(
      data  => {
        this.handlerServerResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    );
  }

  getProductDescription(products: any) {
    this.apigee.getDeploymentStatus(products).subscribe(
      data  => {
        let status = data;
        this.apigee.getProxieRevision(products, '1').subscribe(
          data  => {
            let desc = data;
            console.log('desc:', desc, 'status:', status);
          },
          error => {
            this.handlerError(error);
          }
        );
      },
      error => {
        this.handlerError(error);
      }
    );
  }

  handlerError(error: any) {
    this.notifier.showNotification(
      'error',
      error.error.message
    );
    switch(error.status) {
      case 401:
        sessionStorage.removeItem('jbb-data');
        setTimeout(() => {
            this.router.navigate(['/']);
        },4000);
        break;
    }
  }

  handlerServerResponse(data: any) { 
    this.allProducts = data.products;
    this.allProducts = this.allProducts.sort((a: any, b: any) => {
      if (a['name'] < b['name']) {
        return this.sorted ? -1 : 1;
      }
      if (a['name'] > b['name']) {
        return this.sorted ? 1 : -1;
      }
      return 0;
    });
    console.log('allProducts:', this.allProducts)
  }
}
