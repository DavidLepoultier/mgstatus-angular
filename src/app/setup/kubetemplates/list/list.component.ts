import { Component, OnInit } from '@angular/core';
import { KubeTemplatesService } from 'src/app/services/kube-templates.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  filterBox:any = '';
  searchText: string;
  sorted = true;
  templates: [];
  myClass = '';

  constructor(private tpl: KubeTemplatesService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getConfig();
  }

  getConfig(){
    this.tpl.getAllTemplate().subscribe(
      data => {
        this.templates = data.kubetemplates;
      }
    );
  }

  checkCheckBoxvalue(event: any){
    this.filterBox = event;
  }

}
