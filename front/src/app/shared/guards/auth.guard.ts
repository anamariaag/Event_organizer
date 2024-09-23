import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService : AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if(authService.isLoggedIn()){
    return true;
  }else{
    router.navigate(['']);
    return false;
  }

};
