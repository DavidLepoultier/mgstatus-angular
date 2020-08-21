import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { KongOffersService } from 'src/app/services/kong-offers.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})
export class AddOfferComponent implements OnInit {

  registerOfferForm: FormGroup;
  disabledLifetime: boolean = false;
  disabledSilab: boolean = false;
  myClass = '';

  config = {
    id: '',
    offerName: '',
    lifetime: false,
    lifetimeDays: 1,
    maxOrg: 5,
    maxActiveOrg: 2,
    nginxCPU: 125,
    nginxMemory: 256,
    nginxReplicat: 2,
    dpCPU: 250,
    dpMemory: 512,
    dpReplicat: 2,
    cpCPU: 250,
    cpMemory: 512,
    cpReplicat: 1,
    apiCPU: 25,
    apiMemory: 64,
    apiReplicat: 1,
    dedicatedServer: false,
    validation: false,
    silab: false
  }

  validation_messages = {
    'offerName': [ 
      { type: 'required', message: "Offer name is required" }
    ],
  }

  constructor(private cdref: ChangeDetectorRef, private fb: FormBuilder, private offer: KongOffersService, private router: Router, private snackBar: SnackBarComponent) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.createForms();
  }

  createForms() {
    this.registerOfferForm = this.fb.group({
      id: new FormControl(this.config.id),
      offerName: new FormControl(this.config.offerName, Validators.compose([
        Validators.required,
      ])),
      lifetime: new FormControl(this.config.lifetime),
      lifetimeDays: new FormControl(this.config.lifetimeDays),
      maxOrg: new FormControl(this.config.maxOrg),
      maxActiveOrg: new FormControl(this.config.maxActiveOrg),
      nginxCPU: new FormControl(this.config.nginxCPU),
      nginxMemory: new FormControl(this.config.nginxMemory),
      nginxReplicat: new FormControl(this.config.nginxReplicat),
      dpCPU: new FormControl(this.config.dpCPU),
      dpMemory: new FormControl(this.config.dpMemory),
      dpReplicat: new FormControl(this.config.dpReplicat),
      cpCPU: new FormControl(this.config.cpCPU),
      cpMemory: new FormControl(this.config.cpMemory),
      cpReplicat: new FormControl(this.config.cpReplicat),
      apiCPU: new FormControl(this.config.apiCPU),
      apiMemory: new FormControl(this.config.apiMemory),
      apiReplicat: new FormControl(this.config.apiReplicat),
      dedicatedServer: new FormControl(this.config.dedicatedServer),
      validation: new FormControl(this.config.validation),
      silab: new FormControl(this.config.silab),
    })
  }

  ngAfterContentChecked() {
    if(!this.disabledLifetime) {
      this.registerOfferForm.setControl('lifetimeDays', new FormControl(''));
    }
    if(!this.disabledSilab) {
      this.registerOfferForm.setControl('silab', new FormControl(''));
    }
    this.cdref.detectChanges();
  }

  saveConfig(registerOfferForm: any) {
    if (!registerOfferForm.validation) {
      registerOfferForm.validation = false;
      registerOfferForm.silab = undefined;
    }
    if (!registerOfferForm.lifetime) {
      registerOfferForm.lifetime = false;
      registerOfferForm.lifetimeDays = undefined;
    }
    if (!registerOfferForm.silab) {
      registerOfferForm.silab = false;
    }
    this.offer.addOfferConfig(registerOfferForm).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
    this.router.navigate(['/kong/offers']);
  }

  handlerError(error: any) {
    
  }

}
