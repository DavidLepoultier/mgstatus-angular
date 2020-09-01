import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import {SelectionModel} from '@angular/cdk/collections';
import { SnackBarComponent } from 'src/app/snack-bar/snack-bar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { OrganizationService } from 'src/app/services/organization.service';
import { DeploymentProfileService } from 'src/app/services/deployment-profile.service';
import { KongEnvironmentService } from 'src/app/services/kong-environment.service';
import { KongService } from 'src/app/services/kong.service';
import { DeleteOrganizationComponent } from '../../modals/delete-organization/delete-organization.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserService } from 'src/app/services/user.service';
import { AddUserOrganizationComponent } from '../../modals/add-user-organization/add-user-organization.component';
import { RolesService } from 'src/app/services/roles.service';
import { AuthService } from 'src/app/auth/auth.service';

export interface OrgElement {
  created_at: string;
  name: string;
  datetime: string;
  username: string;
}
@Component({
  selector: 'app-detail-organization',
  templateUrl: './detail-organization.component.html',
  styleUrls: ['./detail-organization.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DetailOrganizationComponent implements OnInit {

  ELEMENT_DATA: OrgElement[];

  pageSizeOptions=[5, 10, 25, 50];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  selection = new SelectionModel<OrgElement>(true, []);
  columnsToDisplay = ['created_at', 'action'];
  columnsToDisplayPlugins = ['created_at', 'name', 'applied_to', 'workspace'];
  columnsToDisplayKong = ['created_at', 'name'];
  columnsToDisplayConsumer = ['created_at','username'];
  columnsToDisplayUser = ['select','email','firstname','lastname','role'];
  columnsToDisplayKongUser = ['created_at','username','email','status'];
  expandedElement: OrgElement | null;

  @ViewChild(MatPaginator, {static: false}) set matPaginator(paginator: MatPaginator) {
    this.dataSource['paginator'] = paginator;
  };
  
  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource['sort'] = sort;
  };
  // @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // @ViewChild(MatSort, {static: false}) sort: MatSort;


  updateOrgForm: FormGroup;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  token = {};
  deployments = [];
  environment = {};
  services = [];
  plugins = [];
  members = [];
  consumers = [];
  routes = [];
  history = [];
  usersEmail = [];
  emailList = [];
  rolesList = [];
  workspaces = [];
  cluster = [];
  adminUsers = [];

  deployState = {
    status: []
  };
  show: boolean = false;
  show_result: boolean = false;
  deleteOrg: boolean = false;
  kongAdminUrl: boolean = false;
  isAuthenticated:boolean = false;
  running: boolean = false;
  newOrg = {};
  status = 1;
  stateStatus = ["created","failed"];
  index = 0;
  deploymentMode = '';
  
  
  menu = {
    _detail: true
  }
  menuLast = false;
  showMenu = "_detail";

  kongAdm = {
    status: []
  };
  userRole = {
    organizations: {POST: false, PUT: false, DELETE: false, GET: false}
  };
  config = {
    id: '',
    orgName: '',
    deployment: '',
    ADMIN_USER: '',
    ADMIN_PASSWORD: '',
    deployState: [],
    environment: {}
  }

  constructor(
    private dialog: MatDialog, 
    private route: ActivatedRoute, 
    private router:Router, 
    private fb: FormBuilder, 
    private org: OrganizationService, 
    private dep: DeploymentProfileService, 
    private envKong: KongEnvironmentService, 
    private snackBar: SnackBarComponent, 
    private kong: KongService, 
    private user: UserService,
    private roles: RolesService,
    private auth: AuthService) { 
  }

  deleteConfirm() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {id: this.config.id, name: this.config.orgName}

    const dialogRef = this.dialog.open(DeleteOrganizationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteOrgId();
      };
    });
  }

  addMemberDial(emailList: any) {
    for ( let index = 0; index < emailList.length; index++ ) {
      this.members.forEach(member => {
        if (member.email == emailList[index]){
          emailList.splice(index, 1);
        }
      })
    }
    for ( let index = 0; index < emailList.length; index++ ) {
      if (emailList[index] == 'admin@orange.com'){
        emailList.splice(index, 1);
      }
    }
    if (emailList.length == 0){
      this.snackBar.openSnackBar('All accounts are already member to this organization','Close','');
    } else {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = false;
      dialogConfig.minWidth = 400;
      dialogConfig.data = {id: this.config.id, emails: emailList, roles: this.rolesList};
  
      const dialogRef = this.dialog.open(AddUserOrganizationComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.addMember(result)
        };
      });
    }
  }

  deleteOrgId() {
    this.org.deleteOrgId(this.config.id).subscribe(
      data => {
        this.snackBar.openSnackBar(data.message,'Close','');
        this.router.navigate(['/orgs']);
      },
      error => {
        this.handlerError(error.error.message);
      })
  }

  myClass = '';

  ngOnInit() {
    this.token = this.auth.jwtTokenDecode()
    window.scrollTo(0, 0);
    this.myClass = '';
    this.getOrgById(this.route.snapshot.params['id']);
    this.createForms();
  }

  createForms() {
    this.updateOrgForm = this.fb.group({
      id: new FormControl(this.config.id),
      deployment: new FormControl(this.config.deployment, Validators.compose([
        Validators.required,
      ]))
    })
  }

  updateProfile(updateOrgForm: any) {
    let newDeployId = { 
      newDeployId: updateOrgForm.deployment 
    }
    this.index = this.history.length
    this.org.changeProfileOrg(updateOrgForm.id, newDeployId).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error)
    );
  }

  redeploy(updateOrgForm: any) {
    let action = { 
      action: "redeploy"
    }
    this.index = this.history.length
    this.org.redeployOrg(updateOrgForm.id, action).subscribe(
      data  => this.handlerSuccess(data),
      error => this.handlerError(error.error.error.message)
    );
  }

  getDeployments(){
    this.dep.getAllDeployment().subscribe(
      data => {
        this.deployments = data.deployments;
        this.deployments.forEach(element => {
          if ( element.id === this.config.deployment ){
            this.deploymentMode = element.deploymentMode;
            this.getEnvironment(element.environmentId);
          }
        })
      }
    )
  }

  getRoles() {
    this.roles.getRoles().subscribe(
      data => {
        this.rolesList = data.roles;
      }
    )
  }

  getEnvironment(id: any){
    this.envKong.getEnvironment(id).subscribe(
      data => {
        this.environment = data.environment
        if(this.config['state'] == "created") {
          // if (this.environment["envType"] == "opensource") {
          if (this.userRole['members'].GET) {
            this.menu['_members'] = false;
            if (this.userRole['members'].DELETE) {
              this.columnsToDisplayUser = ['select','email','firstname','lastname','role'];
            } else {
              this.columnsToDisplayUser = ['email','firstname','lastname','role'];
            }
            this.getMembers(this.route.snapshot.params['id']);
            this.getUsersEmails();
          }
          if (this.userRole['roles'].GET) {
            this.getRoles();
          }
          // }
          this.getKongAdminStatus(this.route.snapshot.params['id']);
        }
      }
    )
  }

  getOrgById(id: any) {
    this.org.getOrgId(id).subscribe(
      data => {
        this.config = data.organization;
        this.userRole = data.userRole;
        this.getDeployments();
        if (data.userRole.history.GET) {
          this.menu['_history'] = false;
          this.getDeployState(this.route.snapshot.params['id']);
        }
        this.createForms();
        if (data.userRole.organizations.DELETE) {
          this.deleteOrg = true;
        }
        if (data.userRole.organizations.PUT) {
          this.kongAdminUrl = true;
        }
      }
    ); 
  }

  getUsersEmails() {
    this.user.getUsersEmails().subscribe(
      data => {
        this.usersEmail = data.users
      }
    )
  }

  getServices(id: any) {
    if (this.environment["envType"] == "enterprise") {
      this.columnsToDisplayKong = ['created_at', 'name', 'target', 'workspace'];
      this.services= [];
      this.setDataSource(this.services)
      let loader = []
      this.workspaces.forEach(element => {
        loader.push(element.name)
      });
      this.workspaces.forEach((element) => {
        this.kong.getKongServicesEnterprise(id, element.name).subscribe(
          data => {
            data.services.data.forEach(service => {
              service['workspace'] = element.name;
              this.services.push(service)
            });
            loader = loader.filter(item => item !== element.name)
            if (loader.length == 0) {
              this.setDataSource(this.services)
              this.setDataSourceOrder('created_at');
              this.show_result = true;
            }
          }
        )
      });
    } else {
      this.kong.getKongServices(id).subscribe(
        data => {
          this.services = data.services.data
          this.setDataSource(this.services)
          this.setDataSourceOrder('created_at');
          this.show_result = true;
        }
      )
    }
  }

  getWorkspaces(id: any) {
    this.columnsToDisplayKong = ['created_at', 'name'];
    this.workspaces = [];
    this.setDataSource(this.workspaces);
    this.kong.getWorkspaces(id).subscribe(
      data => {
        this.workspaces = data.workspaces.data
        this.setDataSource(this.workspaces);
        this.setDataSourceOrder('created_at');
        this.show_result = true;
      }
    )
  }

  getAdminUsers(id: any) {
    this.adminUsers = [];
    this.setDataSource(this.adminUsers)
    let loader = []
    this.workspaces.forEach(element => {
      loader.push(element.name)
    });
    this.workspaces.forEach(element => {
      this.kong.getAdminUsers(id, element.name).subscribe(
        data => {
          data.admins.data.forEach(user => {
            this.adminUsers.push(user)
          });
          loader = loader.filter(item => item !== element.name)
          if (loader.length == 0) {
            this.setDataSource(this.adminUsers)
            this.setDataSourceOrder('created_at');
            this.show_result = true;
          }
        }
      )
    });
  }

  getMembers(id: any) {
    this.members = []
    this.setDataSource(this.members)
    this.org.getMembers(id).subscribe(
      data => { 
        this.members = data.members
        this.setDataSource(this.members)
        this.show_result = true;
      }
    )
  }

  getRoutes(id: any) {
    if (this.environment["envType"] == "enterprise") {
      this.columnsToDisplayKong = ['created_at', 'name', 'basepath', 'workspace'];
      this.routes= [];
      this.setDataSource(this.routes)
      let loader = []
      this.workspaces.forEach(element => {
        loader.push(element.name)
      });
      this.workspaces.forEach(element => {
        this.kong.getKongRoutesEnterprise(id, element.name).subscribe(
          data => {
            data.routes.data.forEach(route => {
              route['basepath'] = [];
              route.paths.forEach(path => {
                route['basepath'].push(path)
              });
              route['workspace'] = element.name;
              this.routes.push(route)
            });
            loader = loader.filter(item => item !== element.name)
            if (loader.length == 0) {
              this.setDataSource(this.routes)
              this.setDataSourceOrder('created_at');
              this.show_result = true;
            }
          }
        )
      });
    } else {
      this.kong.getKongRoutes(id).subscribe(
        data => {
          this.routes = data.routes.data
          this.setDataSource(this.routes);
          this.setDataSourceOrder('created_at');
          this.show_result = true;
        }
      )
    }
  }

  getConsumers(id: any) {
    if (this.environment["envType"] == "enterprise") {
      this.columnsToDisplayConsumer = ['created_at','username', 'workspace'];
      this.consumers= [];
      this.setDataSource(this.consumers)
      let loader = []
      this.workspaces.forEach(element => {
        loader.push(element.name)
      });
      this.workspaces.forEach(element => {
        this.kong.getKongConsumersEnterprise(id, element.name).subscribe(
          data => {
            data.consumers.data.forEach(consumer => {
              consumer['workspace'] = element.name;
              this.consumers.push(consumer)
            });
            loader = loader.filter(item => item !== element.name)
            if (loader.length == 0) {
              this.setDataSource(this.consumers)
              this.setDataSourceOrder('created_at');
              this.show_result = true;
            }
          }
        )
      });
    } else {
      this.kong.getKongConsumers(id).subscribe(
        data => {
          this.consumers = data.consumers.data
          this.setDataSource(this.consumers);
          this.setDataSourceOrder('created_at');
          this.show_result = true;
        }
      )
    }
  }

  getPlugins(id: any) {
    this.plugins = [];
    this.setDataSource(this.plugins)
    if (this.environment["envType"] == "enterprise") {
      let loader = []
      this.workspaces.forEach(element => {
        loader.push(element.name)
      });
      this.workspaces.forEach((element) => {
        this.kong.getKongPluginsEnterprise(id, element.name).subscribe(
          data => {
            data.plugins.data.forEach(plugin => {
              plugin['applied_to'] = [];
              if (plugin.route) {
                plugin['applied_to'].push('Route');
              }
              if (plugin.service) {
                plugin['applied_to'].push('Service');
              }
              if (plugin.consumer) {
                plugin['applied_to'].push('Consumer');
              }
              if (plugin['applied_to'].length === 0)
              plugin['applied_to'].push('Global')
              plugin['workspace'] = element.name;
              this.plugins.push(plugin)
            });
            loader = loader.filter(item => item !== element.name)
            if (loader.length == 0) {
              this.setDataSource(this.plugins)
              this.setDataSourceOrder('created_at');
              this.show_result = true;
            }
          }
        )
      });
    } else {
      this.kong.getKongPlugins(id).subscribe(
        data => {
          this.plugins = data.plugins.data
          this.setDataSource(this.plugins)
          this.setDataSourceOrder('created_at');
          this.show_result = true;
        }
      )
    }
  }

  getDeployState(id: any) {
    this.history = [];
    this.setDataSource(this.history)
    this.org.getDeployStateOrgId(id).subscribe(
      data => {
        this.history = data.organization.deployState
        if (this.status === 0) {
          this.history.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)
          this.deployState = this.history[this.index];
          let checkIndex = this.deployState.status.length - 1;
          if(this.stateStatus.includes(this.deployState.status[checkIndex].state)) {
            this.org.getOrgId(this.route.snapshot.params['id']).subscribe(
              data => {
                this.config = data.organization;
              }
            );
            this.status = 1;
          }
        } else {
          this.setDataSource(this.history);
          this.show_result = true;
        }
      }
    )
  }

  setDataSource(data: any) {
    this.ELEMENT_DATA = data;
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  setDataSourceOrder(field: any) {
    this.dataSource.data.sort((a: any, b: any) => {
      if (a[field] > b[field]) {
          return -1;
      } else if (a[field] < b[field]) {
          return 1;
      } else {
          return 0;
      }
    });
  }

  getKongAdminStatus(id: any) {
    this.kong.getKongAdminStatus(id).subscribe(
      data => {
        if (data.statusCode == 200 && !this.menu['consumers'] ) {
          this.menu['consumers'] = false;
          this.menu['routes'] = false;
          this.menu['_plugins'] = false;
          if (this.environment["envType"] == "enterprise") {
            this.menu['_kongadmins'] = false;
            this.menu['_workspaces'] = false;
            this.getWorkspaces(this.route.snapshot.params['id']);
            this.getAdminUsers(this.route.snapshot.params['id']);
          }
          this.menu['services'] = false;
          let status = {
            code: data.statusCode,
            state: data.status,
          };
          this.kongAdm.status.push(status);
          this.getServices(this.route.snapshot.params['id']);
          this.getRoutes(this.route.snapshot.params['id']);
          this.getConsumers(this.route.snapshot.params['id']);
          this.getPlugins(this.route.snapshot.params['id']);
        }
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource['filter'] = filterValue.trim().toLowerCase();
    if (this.dataSource['paginator']) {
      this.dataSource['paginator'].firstPage();
    }
  }

  autoRefreshOrg(id) {
    let intervalId = setInterval(() => {
      this.menu['_history'] = false;
      this.getDeployState(this.route.snapshot.params['id']);
      if (this.status === 1) clearInterval(intervalId);
    }, 2000);
  }

  close(id) {
    this.getOrgById(id)
    this.running = false;
  }

  goToOrgs() {
    this.router.navigate([`/orgs`]);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: OrgElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  removeMembers(userList: any) {
    let emailList = [];
    userList.forEach(element => {
      emailList.push(element.email)
    });
    this.org.removeMembers(this.route.snapshot.params['id'], emailList).subscribe(
      data => {
        // this.snackBar.openSnackBar(data.message,'Close','');
        this.getMembers(this.route.snapshot.params['id']);
        this.getUsersEmails();
        this.selection.clear();
      }, 
      error => {
        this.getMembers(this.route.snapshot.params['id']);
        this.getUsersEmails();
        this.selection.clear();
      }
    );  
  }

  addMember(emails: any) {
    emails.envType = this.environment["envType"];
    this.org.addMembers(this.route.snapshot.params['id'], emails).subscribe(
      data => {
        this.snackBar.openSnackBar(data.message,'Close','');
        this.getMembers(this.route.snapshot.params['id']);
        this.getUsersEmails();
        this.selection.clear();
      },
      error => {
        this.handlerError(error.error.message);
        this.getMembers(this.route.snapshot.params['id']);
        this.getUsersEmails();
        this.selection.clear();
      }
    )
  }

  updateMember(member: any){
    member.envType = this.environment["envType"];
    this.org.updateMembers(this.route.snapshot.params['id'], member.email,  member).subscribe(
      data => {
        this.snackBar.openSnackBar(data.message,'Close','');
        this.getMembers(this.route.snapshot.params['id']);
        this.getUsersEmails();
        this.selection.clear();
      },
      error => {
        this.handlerError(error.error.message);
        this.getMembers(this.route.snapshot.params['id']);
        this.getUsersEmails();
        this.selection.clear();
      }
    )
  }

  changeMenu(key: any) {
    this.show_result = false;
    switch(key){ 
      case '_history':
        this.expandedElement = null;
        this.setDataSource(this.history)
        this.getDeployState(this.route.snapshot.params['id']);
      break;
      case '_members':
        this.expandedElement = null;
        this.setDataSource(this.members)
        this.getMembers(this.route.snapshot.params['id']);
      break;
      case 'services':
        this.expandedElement = null;
        this.setDataSource(this.services)
        this.getServices(this.route.snapshot.params['id']);
      break;
      case 'routes':
        this.expandedElement = null;
        this.setDataSource(this.routes)
        this.getRoutes(this.route.snapshot.params['id']);
      break;
      case 'consumers':
        this.expandedElement = null;
        this.setDataSource(this.consumers)
        this.getConsumers(this.route.snapshot.params['id']);
      break;
      case '_plugins':
        this.expandedElement = null;
        this.setDataSource(this.plugins)
        this.getPlugins(this.route.snapshot.params['id']);
      break;
      case '_workspaces':
        this.expandedElement = null;
        this.setDataSource(this.workspaces)
        this.getWorkspaces(this.route.snapshot.params['id']);
      break;
      case '_kongadmins':
        this.expandedElement = null;
        this.setDataSource(this.adminUsers)
        this.getAdminUsers(this.route.snapshot.params['id']);
      break;
    }
    for(let m in this.menu){
      if (key == m) {
        this.menu[m] = true;
      } else {
        this.menu[m] = false;
      }
    }
    let last = Object.keys(this.menu)[Object.keys(this.menu).length-1];
    if ( last == key ) {
      this.menuLast = true
    } else {
      this.menuLast = false
    }
    this.showMenu = key;
  }

  handlerSuccess(data: any) {
    this.snackBar.openSnackBar(data.message,'Close','');
    this.org.getOrgId(this.route.snapshot.params['id']).subscribe(
      data => {
        this.config = data.organization;
      }
    );
    this.running = true;
    this.status = 0;
    this.autoRefreshOrg(this.route.snapshot.params['id']);
  }

  handlerError(error: any) {
    this.snackBar.openSnackBar(error,'Close','failed');
  }
}