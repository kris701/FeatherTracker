// https://stackoverflow.com/questions/78822735/authorization-header-with-jwt-in-angular-to-all-requests
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { JWTTokenHelpers } from './helpers/jwtTokenHelpers';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);
    const router = inject(Router);
    var authToken = localStorage.getItem('jwtToken');
    if (authToken) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });
    }
    return next(req).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                if (JWTTokenHelpers.IsExpired()) localStorage.removeItem('jwtToken');
                if (localStorage.getItem('impersonating')) localStorage.removeItem('impersonating');
                router.navigate(['/platform/auth']);
            } else messageService.add({ severity: 'error', summary: 'Error duing HTTP request!', detail: '[' + error.error.status + '] Error: ' + error.error.message, life: 10000 });
            return throwError(() => error);
        })
    );
};
