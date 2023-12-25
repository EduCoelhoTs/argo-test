import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UtilityService } from '../../services/Utility.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const utilityService = inject(UtilityService);
  const token = localStorage.getItem('token') || '';

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
