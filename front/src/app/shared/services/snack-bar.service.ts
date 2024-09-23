import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor( 
    private _snackBar: MatSnackBar) { }


  successSnackBar(message: string){
    this._snackBar.open(
      message,
      '',{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['green-snackbar']
      }
    );
  }

  errorSnackBar(message: string){
    this._snackBar.open(
      message,
      'Close',{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 4000,
          panelClass: ['red-snackbar']
      }
    );
  }

  notificationSnackBar(message: string){
    this._snackBar.open(
      message,
      'Close',{
          horizontalPosition: 'center',
          verticalPosition: 'top'
      }
    );
  }

}
