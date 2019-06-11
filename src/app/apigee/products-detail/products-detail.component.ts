import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ApigeeService } from '../apigee.service';
import { NotifierSvc } from '../../services/notifier.service';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-products-detail',
  templateUrl: './products-detail.component.html',
  styleUrls: ['./products-detail.component.scss']
})
export class ProductsDetailComponent implements OnInit {

  notifier: NotifierSvc;
  allProducts: any = [];
  descProduct: any = [];
  searchText: string;
  sorted = true;
  currentProduct: string;
  jwtDecoded: object = {};
  disabled: boolean = true;
  updateProductForm: FormGroup;
  fromTo: object = {
    link: '',
    display: ''
  };

  constructor(private router:Router, private auth:AuthService, private apigee:ApigeeService, notifierSvc:NotifierSvc, private fb:FormBuilder, private route:ActivatedRoute) { 
    this.notifier = notifierSvc;
  }

  ngOnInit() {
    if(!this.auth.userIsLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.jwtDecode();
    if(this.jwtDecoded['role'] === "orgAdmin" || this.jwtDecoded['role'] === "developer" ) {
      switch(this.jwtDecoded['role']) {
        case 'orgAdmin':
          this.fromTo = {
            link: 'products',
            display: 'Products'
          }
        break;
        case 'developer':
          this.fromTo = {
            link: 'myProducts',
            display: 'myProducts'
          }
          this.getProducts();
        break;
      }
      this.currentProduct = this.route.snapshot.params['id'];
      this.getProductDescription(this.currentProduct);
    } else {
      this.router.navigate(['/']);
    }
  }

  jwtDecode() {
    this.jwtDecoded = this.auth.jwtTokenDecode();
  }

  createForms() {
    this.updateProductForm = this.fb.group({
      action: new FormControl('update'),
      // basePath: new FormControl({value: this.descProduct['proxie'].basepaths[0], disabled: this.disabled}),
      // target: new FormControl({value: this.descProduct['targets'], disabled: this.disabled}),
      // proxie: new FormControl(this.descProduct['proxie'].name)
    })
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

  getProductDescription(product: any) {
    this.apigee.getProduct(product).subscribe(
      data  => {
        this.descProduct = data.product;
        this.createForms();
      },
      error => {
        this.handlerError(error);
      }
    );
  }

  updateMyProxies(proxie: any){
    for (let index = 0; index < this.allProducts.products.length; index++) {
      if(this.allProducts.products[index] === proxie) {
        this.allProducts.products.splice(index, 1);
      }
    }
    let body = {
      user: this.jwtDecoded['user'],
      apis: this.allProducts['apis'],
      products: this.allProducts['products']
    }
    this.apigee.updateMyProxie(body).subscribe(
      data => {
        console.log('remove done')
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  deleteProduct(){
    this.apigee.deleteProduct(this.route.snapshot.params['id']).subscribe(
      data => {
        this.handlerDeleteProductResponse(data);
      },
      error => {
        this.handlerError(error);
      }
    )
  }

  handlerServerResponse(data: any) {
    this.allProducts = data.apis;
  }

  handlerDeleteProductResponse(data: any) {
    this.notifier.showNotification(
      'success',
      `${data.message} deleted.`
    );
    this.updateMyProxies(this.route.snapshot.params['id'])
    setTimeout(() => {
        this.router.navigate(['/' + this.fromTo['link']],);
    }, 2000);
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

}
