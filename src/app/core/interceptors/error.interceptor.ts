import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === HttpStatusCode.Unauthorized && !req.url.includes('auth/login')) {
        localStorage.removeItem('inventario_token');
        localStorage.removeItem('inventario_user');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    }),
  );
};
