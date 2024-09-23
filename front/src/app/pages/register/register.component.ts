import { Component, OnDestroy } from '@angular/core';
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
import { takeUntil } from 'rxjs/operators';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  
  form: FormGroup;
  error: boolean = false;
  userLoginStatus: boolean = false;

  user: User = {email: '', password: ''}
  action: string = 'REGISTER';

  private unsubscribe = new Subject<void>();


  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private router: Router,
    private authService: AuthService, 
    private loginService: LoginService,
    private socialAuthService: SocialAuthService,
    private snackBar: SnackBarService,
  ){
    
    this.authService.loginStatus.subscribe((status: boolean) =>{
      this.userLoginStatus = status;
    })


    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      birthdate: ['', [Validators.required]],
      exp: ['', [Validators.required, Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirm: ['', [Validators.required, Validators.minLength(5)]],
      terms: [false, Validators.requiredTrue],
      userType: ['1']
    }, {
      validators: [() => this.comparePasswords()]
    });
  }

  comparePasswords(){
    if(!this.form) return null;

    const {password, confirm} = this.form.getRawValue();
    if(password === confirm){
      return null;
    } else {
      return {
        match: true
      }
    }
  }

  register(user: User){
    this.loginService.createUserRequest(user!).subscribe({
      next: (response: Token) => {
        //sig pasos - Guardar el token con el tokenService
        //console.log('res', response)
        this.authService.setToken(response.token); 
        this.user.password = ''; 
        this.userLoginStatus = true; 
        this.getCurrentUser(user.email!);
        this.router.navigate(['home']);
        this.snackBar.successSnackBar('Register completed, you have logged in successfully!');
      },
      error: (response: Error) => {
        this.snackBar.errorSnackBar('No se pudo iniciar sesión. '+ response.error);
      }
    });
  }

  onSubmit(){
    if(this.form.valid){
      const {userName, email, password, name, lastName, birthdate, userType, exp} = this.form.getRawValue();
      this.user.userName = userName;
      this.user.email = email; 
      this.user.password = password;
      this.user.name = name; 
      this.user.lastName = lastName; 
      this.user.birthdate = birthdate; 
      this.user.userType = userType == 1 ? 'USER' : 'ORG';
      this.user.exp = exp
      this.register(this.user);
    }
  }

  getCurrentUser(email: string){
    this.userService.getUserRequest(email).subscribe({
      next: (response: User) => {
        //console.log('Encontré al usuario del email');
        //console.log(response);
        this.userService.setUser(response);
        //console.log(this.userService.getUser());

      },
      error: (response: Error) => {
        this.snackBar.errorSnackBar('No se encontró al usuario del email. ' + response.error);
      }
    })
  }

  ngOnDestroy(): void {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

  googleRegister(action: string){
    this.authService.setAction(action);
    window.location.href = environment.apiUrl+'googleAPI';
  }

}
