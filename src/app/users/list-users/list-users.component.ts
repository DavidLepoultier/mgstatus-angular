import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';


export interface UserElement {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  tenants: [];
}

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ListUsersComponent implements OnInit {

  ELEMENT_DATA: UserElement[];

  pageSizeOptions=[10, 25, 50, 100];
  dataSource: MatTableDataSource<UserElement>;
  columnsToDisplay = ['firstname', 'lastname', 'email', 'verified'];
  expandedElement: UserElement | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  searchText: string;
  myClass = '';

  constructor(private user: UserService, private toastr: ToastrService) { }
  
  ngOnInit() {
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getUsers();
  }

  getUsers(){
    this.user.getUsers().subscribe(
      data => {
        this.ELEMENT_DATA = data.users;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  modify(config: any){
    this.user.updateUser(config.id, config).subscribe(
      data => {
        this.getUsers();
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

  deleteUser(id: any){
    this.user.deleteUser(id).subscribe(
      data => {
        this.handlerSuccess(data);
        this.getUsers();
      }
    )
  }

  handlerSuccess(data: any) {
    this.toastr.success(data.message);
  }

  handlerError(error: any) {
    console.log(error)
    this.toastr.success(error.message.message);
  }

}
