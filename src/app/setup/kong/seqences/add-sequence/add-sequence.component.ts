import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { KubeTemplatesService } from 'src/app/services/kube-templates.service';
import { KongSequenceService } from 'src/app/services/kong-sequence.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-sequence',
  templateUrl: './add-sequence.component.html',
  styleUrls: ['./add-sequence.component.scss']
})
export class AddSequenceComponent implements OnInit {

  sequenceForm: FormGroup;

  templates: [];
  show: boolean = false;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  account_validation_messages = {
    'seqName': [ 
      { type: 'required', message: "Environment name is required" }
    ]
  }

  constructor( private router:Router, private fb: FormBuilder, private seq: KongSequenceService, private toastr: ToastrService, private tpl: KubeTemplatesService) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getTplConfig();
    this.createForms();
  }

  getTplConfig(){
    this.tpl.getAllTemplate().subscribe(
      data => {
        this.templates = data.kubetemplates;
      }
    );
  }

  createForms() {
    // user links form validations
    this.sequenceForm = this.fb.group({
      id: new FormControl(''),
      seqName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      sequence_points: this.fb.array([this.fb.group({template:''})])
    })
  }

  get sequencePoints() {
    return this.sequenceForm.get('sequence_points') as FormArray;
  }

  addSequencePoint() {
    this.sequencePoints.push(this.fb.group({template:''}));
  }

  deleteSequencePoint(index) {
    this.sequencePoints.removeAt(index);
  }

  saveConfig(sequenceForm: any) {
    console.log(sequenceForm)
    this.seq.addSeqConfig(sequenceForm).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.toastr.success(data.message);
    this.router.navigate(['/kong/sequences']);
  }

  handlerError(error: any) {
    
  }

}
