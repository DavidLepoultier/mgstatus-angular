// import {Component, Inject, OnInit} from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { map, startWith } from 'rxjs/operators';

import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


export interface DialogData {
  id: String;
  emails: [];
  roles: [];
}

/** list of banks */
// export const EMAILS: DialogData[] = [];

@Component({
  selector: 'app-add-user-organization',
  templateUrl: './add-user-organization.component.html',
  styleUrls: ['./add-user-organization.component.scss']
})
export class AddUserOrganizationComponent implements OnInit {

  /** list of emails */
  // protected emails: DialogData;

  /** control for the selected email for multi-selection */
  public emailMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public emailMultiFilterCtrl: FormControl = new FormControl();
  public role: FormControl = new FormControl();

  /** list of email filtered by search keyword */
  public filteredEmailsMulti: ReplaySubject<DialogData[]> = new ReplaySubject<DialogData[]>(1);

  public tooltipMessage = 'Select All / Unselect All';

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  emails = [];
  roles = [];

  constructor(
    private dialogRef: MatDialogRef<AddUserOrganizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.emails = this.data.emails;
    this.roles = this.data.roles
    this.filteredEmailsMulti.next(this.emails.slice());

    this.emailMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterEmailsMulti();
      });
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredEmailsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.emailMultiCtrl.patchValue(val);
        } else {
          this.emailMultiCtrl.patchValue([]);
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  add() {
    let result = {
      emails: this.emailMultiCtrl.value,
      role: this.role.value
    } ;
    this.dialogRef.close(result);
  }

  protected filterEmailsMulti() {
    if (!this.emails) {
      return;
    }
    // get the search keyword
    let search = this.emailMultiFilterCtrl.value;
    if (!search) {
      this.filteredEmailsMulti.next(this.emails.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the emails
    this.filteredEmailsMulti.next(
      this.emails.filter(email => email.toLowerCase().indexOf(search) > -1)
    );
  }
}
