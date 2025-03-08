import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
//   const authService = inject(AuthService);
//   const userToken = authService.getCurrentUser().auth_token
//   const modifiedReq = req.clone({
//     headers: req.headers.set('Authorization', `Bearer ${userToken}`),
//   });

  return next(req)
    .pipe(
        catchError(err => {
            if (err.status === 401) {
                Swal.fire({
                    title: "Invalid User Session!",
                    icon: "warning",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    showConfirmButton: true,
                    confirmButtonText: "Back to Login",
                    }).then((response) => {
                        if (response.isConfirmed) {
                            localStorage.clear();
                            router.navigate(['/login']);
                        }
                    });            
            } else if (err.status === 400) {
                Swal.close();
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: err.error.message,
                    showConfirmButton: false,
                    timer: 2000
                  });
            } else if (err.status === 500) {
                Swal.close();
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "error",
                    title: err.error.message,
                    showConfirmButton: false,
                    timer: 2000
                  });
            }
                
            const error = err.message || err.statusText;
            return throwError(error);
        }
    ));
};
