import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

  constructor() { }
  
  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
  }

}
