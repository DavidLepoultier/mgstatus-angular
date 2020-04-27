import { Component, Inject } from '@angular/core';
import { 
  MatSnackBar, 
  MatSnackBarConfig, 
  MatSnackBarHorizontalPosition, 
  MatSnackBarVerticalPosition 
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent {
  
  addExtraClass: boolean = false;
  
  message: string = 'Snack Bar opened.';
  actionButtonLabel: string = '';
  action: boolean = true;
  setAutoHide: boolean = true;
  autoHide: number = 3000;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(public snackBar: MatSnackBar) { }
  
	openSnackBar(message: string, action: string, className: string) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = this.setAutoHide ? this.autoHide : 0;
    if (className === 'failed') {
      config.panelClass = ['snackBar-fail'];
    } else {
      config.panelClass = ['snackBar-ok'];
    }
    this.snackBar.open(message, this.action ? action : undefined, config);
  }

}
