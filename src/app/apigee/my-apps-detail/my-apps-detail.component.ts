import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-apps-detail',
  templateUrl: './my-apps-detail.component.html',
  styleUrls: ['./my-apps-detail.component.scss']
})
export class MyAppsDetailComponent implements OnInit {
  modalFormLoginEmail = new FormControl('', Validators.email);
  modalFormLoginPassword = new FormControl('', Validators.required);
  modalFormRegisterEmail = new FormControl('', Validators.email);
  modalFormRegisterPassword = new FormControl('', Validators.required);
  modalFormRegisterRepeatPassword = new FormControl('', Validators.required);
  constructor() { }

  ngOnInit() {
  }

}
