import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {

  notifier: NotifierSvc;
  allProducts: any = [];
  searchText: string;
  sorted = true;
  jwtDecoded: object = {};
  orgPref:any;

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private fb:FormBuilder) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "developer") {
      this.orgPref = JSON.parse(this.auth.userOrgPreference());
      this.getProducts();
    } else {
      this.router.navigate(['/']);
    }
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  getProducts() {
    this.apigee.getMyProxies().subscribe(
      data => {
        this.handlerServerResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  handlerError(error: any) {
    this.notifier.showNotification(
      'error',
      error.error.message
    );
    switch(error.status) {
      case 401:
        sessionStorage.removeItem('jbb-data');
        break;
    }
  }

  handlerServerResponse(data: any) {
    this.allProducts = data.apis;
    // this.allProducts = this.allProducts.sort((a: any, b: any) => {
    //   if (a['displayName'] < b['displayName']) {
    //     return this.sorted ? -1 : 1;
    //   }
    //   if (a['displayName'] > b['displayName']) {
    //     return this.sorted ? 1 : -1;
    //   }
    //   return 0;
    // });
    //console.log('allProducts:', this.allProducts)
  }

}
