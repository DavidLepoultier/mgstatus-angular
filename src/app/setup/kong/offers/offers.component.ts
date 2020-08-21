import { Component, OnInit } from '@angular/core';
import { KongOffersService } from 'src/app/services/kong-offers.service'

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  searchText: string;
  offers: [];
  myClass = '';

  constructor(private offer: KongOffersService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getOffers();
  }

  getOffers(){
    this.offer.getOffers().subscribe(
      data => {
        this.offers = data.offers;
      }
    );
  }
}
