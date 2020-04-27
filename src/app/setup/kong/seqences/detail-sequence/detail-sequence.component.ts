import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { KubeTemplatesService } from 'src/app/services/kube-templates.service';
import { KongSequenceService } from 'src/app/services/kong-sequence.service';

@Component({
  selector: 'app-detail-sequence',
  templateUrl: './detail-sequence.component.html',
  styleUrls: ['./detail-sequence.component.scss']
})
export class DetailSequenceComponent implements OnInit {

  sequenceForm: FormGroup;

  templates: [];
  show: boolean = false;
  jbbData:any = null;
  isAuthenticated:boolean = false;
  welcomeMessage:String = '';

  config = {
    id: '',
    seqName: '',
    sequence_points: [],
  }

  account_validation_messages = {
    'seqName': [ 
      { type: 'required', message: "Environment name is required" }
    ]
  }

  constructor( private router:Router, private fb: FormBuilder, private seq: KongSequenceService, private snackBar: SnackBarComponent, private tpl: KubeTemplatesService, private route: ActivatedRoute) { 
  }

  myClass = '';

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getTplConfig();
    this.createForms();
    this.getSequence(this.route.snapshot.params['id']);

  }

  getSequence(id: any){
    this.seq.getSequence(id).subscribe(
      data => {
        this.config = data.sequence;
        console.log(this.config)
        this.createForms();
      },
      error => this.handlerError(error)
    );
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
      id: new FormControl(this.config.id),
      seqName: new FormControl(this.config.seqName, Validators.compose([
        Validators.required,
      ])),
      sequence_points: this.fb.array(this.config.sequence_points)
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

  deleteSeq(){
    this.seq.deleteSeq(this.route.snapshot.params['id']).subscribe(
      data => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  updateConfig(registerEnvForm: any) {
    this.seq.updateSeqConfig(this.route.snapshot.params['id'], registerEnvForm).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
    this.router.navigate(['/kong/sequences']);
  }

  handlerError(error: any) {
    
  }

}
