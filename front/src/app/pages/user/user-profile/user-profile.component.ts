import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../../dialogs/edit-profile-dialog/edit-profile-dialog.component';
import { cloneDeep } from 'lodash';
import { ChangePasswordComponent } from '../../dialogs/change-password/change-password.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent{

  user: User = {userName: '', email: ''};
  tempUser: User =  {userName: '', email: ''};
  filename: string = '';
  imageUrl : string = `${environment.apiUrl}assets`;

  constructor(private userService: UserService, 
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: SnackBarService){
    this.user = this.userService.getUser();
    this.tempUser = this.user;
    //console.log(this.user);
  }

  clickFileSelector(input: HTMLInputElement){
    input.click();
  }

  selectFile(e: Event){
    const input = e.target as HTMLInputElement;

    this.userService.upload(this.user._id!, input).subscribe({
      next: (response) => {
        this.user = response;
        this.user = {...this.user, photo: `${response.photo}?${new Date().getTime()}` }; 
        this.snackBar.successSnackBar('File uploaded successfully!');
      },
      error: () => {
        this.snackBar.errorSnackBar("File not supported");
      }
    });
  }

  editProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent,{
      data: cloneDeep(this.user)
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        delete result.password;
        this.userService.updateUsersRequest(result).subscribe({
          next: (response) => {
            this.user = response;
            this.snackBar.successSnackBar('Profile updated successfully!');
          },
          error: () => {
            this.snackBar.errorSnackBar('Something happened, please try again.');
          }
        });
      }
    });
  }

  changePasswordDialog(){
    const dialogRef = this.dialog.open(ChangePasswordComponent,{
      data: cloneDeep(this.user)
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        result._id = this.user._id;
        result.password = this.user.password

        this.userService.updateUsersRequest(result).subscribe({
          next:(response) => {
            this.snackBar.successSnackBar('Password updated successfully!');
          },
          error: (err) => {
            this.snackBar.errorSnackBar('Current password is Incorrect, please try again.');          
          }

        })

      }
    })
  }
}
