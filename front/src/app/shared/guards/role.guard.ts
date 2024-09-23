import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);

  const userService : UserService = inject(UserService);
  const requiredRole: string = route.data['role'];

  if(userService.getRole() === requiredRole){
    return true; 
  } else {
    router.navigate(['']);
    return false; 
  }
};
