import { Component, OnInit, Output, EventEmitter, Input, INJECTOR } from '@angular/core';
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { NewUserDialogComponent } from '../../dialogs/new-user-dialog/new-user-dialog.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { Error } from 'src/app/shared/interfaces/error';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: User[] = []; //receives all users from Database Request
  displayedColumns: string[] = ['userName', 'name','lastName','email','userType', 'department','edit', 'delete'];
  error: boolean = false; //handles request error

  currentUser: User | null = null;

  updatedUser: User | null = null;

  newCreatedUser: User = {email: '', userName: ''};

  confirmPassword : String = '';

  constructor(
    private userService: UserService, 
    private dialog: MatDialog,
    private loginService: LoginService,
    private snackBar: SnackBarService){ //inject userService to component
  }

  ngOnInit(){
    this.getUsers();
  }

  getUsers(){
    this.userService.getUsersRequest().subscribe({
      next: (response: User[]) => {
        this.error = false;
        this.users = response;
        //console.log(this.users);
      },
      error: () => {
        this.error = true;
      }
    })

  }

  toggleEdit(user: User): void{
    if(!user.status){
      this.currentUser = JSON.parse(JSON.stringify(user));
      //console.log("currentUser:", this.currentUser);
    }
    user.status = !user.status;
  }

  save(user: User): void{
    //console.log("Previous user: ", user);
    //use POST request for updating
    user.status = false;
    this.userService.updateUsersRequest(user).subscribe({
      next: (response: User) =>{
        this.error = false;
        //console.log("Update response: ", response);
        this.snackBar.successSnackBar('User updated successfully!');
      },
      error: () => {
        this.error = true;
        this.snackBar.errorSnackBar('Something happened, please try again.')
      }
    });
    this.currentUser = null;
  }

  cancel(user: User): void{
    if(this.currentUser){
      const index = this.users.findIndex(x => x._id === this.currentUser!._id);

      if(index !== -1){
        this.users[index] = this.currentUser;
        this.users = [...this.users]; 
      }
      this.currentUser = null;
    }
    user.status = false;
  }

  delete(userToDelete: User){
    //First pop a modal for confirmation
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    userToDelete.status = false;

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(userToDelete._id);
        this.userService.deleteUsersRequest(userToDelete).subscribe({
          next: (response) => {
            this.error = false;
            this.users = this.users.filter(user => user._id !== userToDelete._id);
            this.snackBar.successSnackBar('User deleted!');
          },
          error: (response: Error) => {
            this.snackBar.errorSnackBar(response.error);
          }
        });
      }
    });
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(NewUserDialogComponent,{
      data: this.newCreatedUser
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        if(result.userType == '1'){
          result.userType = 'USER';
        }else if(result.userType == '2'){
          result.userType = 'ORG';
        }else{
          result.userType = 'ADMIN';
        }
        this.newCreatedUser = result;
        //console.log(this.newCreatedUser);
        this.addNewUser(this.newCreatedUser);

      }  
    })

  }

  addNewUser(newUserToCreate: User): void{
    this.loginService.createUserRequest(newUserToCreate).subscribe({
      next: (response) => {
        //console.log('Ya volví de crear el nuevo usuario');
        this.getUsers();
      },
      error:(err: Error) => {
        this.snackBar.errorSnackBar('User could not be created. ' + err.error);
      }
    });


  }
}
