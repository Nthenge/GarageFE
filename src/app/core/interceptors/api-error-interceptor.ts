import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleApiError } from '../utils/error-handler';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const token = authService.getToken();

  

  //token, exists clone the request with authorization header

if (!req.url.includes('/users/login') && !req.url.includes('/users/register')) {
  if (token) {
    console.log('token attached yes', token)
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

  //continue with request, apply golabl error handling
  return next(req).pipe(
    catchError(err => handleApiError(err))
  );
};
