import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

export interface DialogData {
  id: string;
  name: string;
}

@Component({
  selector: 'app-delete-organization',
  templateUrl: './delete-organization.component.html',
  styleUrls: ['./delete-organization.component.scss']
})
export class DeleteOrganizationComponent implements OnInit {

  constructor(
      private dialogRef: MatDialogRef<DeleteOrganizationComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {

      // this.description = description;


      // this.form = fb.group({
      //     description: [description, Validators.required],
      //     category: [category, Validators.required],
      //     releasedAt: [moment(), Validators.required],
      //     longDescription: [longDescription,Validators.required]
      // });

  }

  ngOnInit() {

  }

  close() {
      this.dialogRef.close();
  }

}
