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


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  formPasswords: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private formBuilder: FormBuilder,
  ) {

    this.formPasswords = formBuilder.group({
      currentpassword: ['', [Validators.required, Validators.minLength(5)]],
      newpassword: ['', [Validators.required, Validators.minLength(5)]]
    }, { });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  onCreateUser(){
    if(this.formPasswords.valid){
      // console.log(this.formCreateUser.value);
      this.dialogRef.close(this.formPasswords.value);
    }
  }



}
