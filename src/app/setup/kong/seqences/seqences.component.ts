import { Component, OnInit } from '@angular/core';
import { KongSequenceService } from 'src/app/services/kong-sequence.service';

@Component({
  selector: 'app-seqences',
  templateUrl: './seqences.component.html',
  styleUrls: ['./seqences.component.scss']
})
export class SeqencesComponent implements OnInit {

  sequences: [];
  myClass = '';
  
  constructor(private seq: KongSequenceService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getConfig();
  }

  getConfig(){
    this.seq.getAllSequence().subscribe(
      data => {
        this.sequences = data.sequences;
      }
    );
  }
}
