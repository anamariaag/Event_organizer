import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loginStatus: boolean = false; 

  user: User = {email: '', password: ''};
  role: string = '';
  eventRoute: string = '';
  userType : String = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService) {
    
    this.authService.loginStatus.subscribe((status: boolean) => {
      this.loginStatus = status; 
    });
      
    this.userService.userType.subscribe((userType: String) => {
      this.userType = userType;
    }); 
      
    this.userService.role.subscribe((role: string) => {
      this.role = role;
      this.eventRoute = role == 'ADMIN' || role == 'ORG'? 'events/org': 'events/user';
    });
  }

  ngOnInit(): void {
  }
  
  logOut(){
    this.authService.removeToken();
    this.userService.removeUser();
    this.router.navigate(['']);
  }


}
