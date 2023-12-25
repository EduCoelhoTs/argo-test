import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

   const oauthService: AuthService = inject(AuthService);
   const router: Router = inject(Router);


   if(oauthService.isAuthenticated()) {
    return true;
   }
  
   router.navigate(['/login']);
   return false;
};
