import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/shared/interfaces/user';
import { MaterialModule } from 'src/app/modules/material/material.module';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss']
})
export class NewUserDialogComponent {

  formCreateUser: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private formBuilder: FormBuilder,
  ) {

    this.formCreateUser = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthdate: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirm: ['', [Validators.required, Validators.minLength(5)]],
      exp: ['', [Validators.required, Validators.maxLength(6)]],
      userType: ['1']
    }, {
      validators: [() => this.comparePasswords()]
    });
  }

  comparePasswords(){
    if(!this.formCreateUser) return null;

    const {password, confirm} = this.formCreateUser.getRawValue();
    if(password === confirm){
      return null;
    } else {
      return {
        match: true
      }
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  onCreateUser(){
    if(this.formCreateUser.valid){
      // console.log(this.formCreateUser.value);
      this.dialogRef.close(this.formCreateUser.value);
    }
  }




}
