import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { Token } from 'src/app/shared/interfaces/token';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user';
import { Error } from 'src/app/shared/interfaces/error';

@Component({
  selector: 'app-apigoogle',
  templateUrl: './apigoogle.component.html',
  styleUrls: ['./apigoogle.component.scss']
})
export class ApigoogleComponent {
  code: string | null = null; 
  action: string | null = null; 
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute, 
    private loginService: LoginService, 
    private authService: AuthService,
    private router: Router,
    private snackBar: SnackBarService,
    private userService: UserService) {}

  ngOnInit(): void {
    // Subscribe to query parameters
    this.route.queryParams.subscribe(params => {
      this.code = params['code']; // Get the 'code' query parameter
      console.log('Code:', this.code); // Print the code
    }); 

    this.action = this.authService.getAction();

    if(this.code){
      this.loginService.googleApiLogin(this.code!, this.action!).subscribe({
        next: (response: Token) => {
          this.authService.setTokenGoogle(JSON.stringify(response.idToken));
          this.authService.removeAction();
          // this.user.password = '';
          // this.userLoginStatus = true;
          this.isLoading = false;
          this.authService.setToken(response.token);
          this.getCurrentUser(response.userEmail!);
          this.router.navigate(['home']);
          this.snackBar.successSnackBar('Login completed successfully!');     
        },
        error: (response: Error) => {
          this.isLoading = false;
          this.authService.removeAction();
          this.router.navigate(['']);
          this.snackBar.errorSnackBar('No se pudo iniciar sesión. '+ response.error);
        }
      })
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
        this.snackBar.errorSnackBar('No se encontró al usuario del email' + response.error);
      }
    })
  }





}
