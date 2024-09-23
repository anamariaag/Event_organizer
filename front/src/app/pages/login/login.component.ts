import { Input, Component, Output, EventEmitter, OnChanges, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/user';
import { Token } from 'src/app/shared/interfaces/token';
import { Error } from 'src/app/shared/interfaces/error';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  form: FormGroup;
  error: boolean = false;
  userLoginStatus: boolean = false;
  action: string = 'LOGIN';

  currentUser: User = {email: '', password: ''}

  user: User = {email: '', password: ''}

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private router: Router,
    private authService: AuthService, 
    private loginService: LoginService,
    private socialAuthService: SocialAuthService,
    private snackBar: SnackBarService){
    // this.userService.loginUser.subscribe((user: User) => {
    //   this.user = user;
    //   console.log(this.user);
    // })

    this.authService.loginStatus.subscribe((status: boolean) =>{
      this.userLoginStatus = status;
    })

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    }, {});

 
  }

  hasError(controlName: string, errorName: string){
    return this.form.controls[controlName].errors &&
      this.form.controls[controlName].errors![errorName];
  }

  login(user: User){
    this.loginService.login(user.email!, user.password!).subscribe({
      next: (response: Token) => {
        this.authService.setToken(response.token); 
        this.user.password = ''; 
        this.userLoginStatus = true;
        this.getCurrentUser(user.email!); //setear user en userservice
        this.router.navigate(['home']); //home
        this.snackBar.successSnackBar('Login completed successfully!');
      },
      error: (response: Error) => {
        this.snackBar.errorSnackBar('No se pudo iniciar sesión. '+ response.error);
      }
    });

  }

  googleLogin(action: string){
    this.authService.setAction(action);
    window.location.href = environment.apiUrl+ `googleAPI`;
  }

  onSubmit(){
    if (this.form.valid) {
      const {email, password} = this.form.getRawValue();
      this.user.email = email;
      this.user.password = password;
      this.login(this.user);
    }
  }

  getCurrentUser(email: string){
    this.userService.getUserRequest(email).subscribe({
      next: (response: User) => {
        this.userService.setUser(response);
      },
      error: (response: Error) => {
        this.snackBar.errorSnackBar('No se encontró al usuario del email' + response.error);
      }
    })
  }

  ngOnDestroy(): void {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

 
 

}
