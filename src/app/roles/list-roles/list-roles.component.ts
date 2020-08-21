import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesService } from 'src/app/services/roles.service'
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface RoleElement {
  id: string;
  name: string;
  level: number;
  organizations: object;
  history: object;
  members: object;
  consumers: object;
  routes: object;
  services: object;
  users: object;
  roles: object;
}

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ListRolesComponent implements OnInit {

  ELEMENT_DATA: RoleElement[];

  pageSizeOptions=[5, 10, 25, 50];
  dataSource: MatTableDataSource<RoleElement>;
  columnsToDisplay = ['name'];
  expandedElement: RoleElement | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  searchText: string;
  myClass = '';

  constructor(private roles: RolesService, private snackBar: SnackBarComponent) { }
  
  ngOnInit() {
      window.scrollTo(0, 0);
      this.myClass = '';
      this.getRoles();
  }

  getRoles(){
    this.roles.getRoles().subscribe(
      data => {
        this.ELEMENT_DATA = data.roles;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  modify(config: any){
    this.roles.updateRole(config.id, config).subscribe(
      data => {
        this.getRoles();
        this.handlerSuccess(data)
      },
      error => this.handlerError(error.error)
    )
  }

  deleteConfirm(id: any){
    this.roles.deleteRole(id).subscribe(
      data => {
        this.getRoles();
        this.handlerSuccess(data)
      },
      error => this.handlerError(error.error)
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
  }

  handlerError(error: any) {
    console.log(error)
    this.snackBar.openSnackBar(error.message.message,'Close','failed');
  }

}
