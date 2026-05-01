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
                sessionStorage.setItem('redirectTo', router.routerState.snapshot.url);
                router.navigate(['/auth']);
            } else {
                if (error.error.details && error.error.message)
                {
                    if (error.error.details && error.error.details.length < 256) messageService.add({ severity: 'error', summary: error.error.message, detail: error.error.details, life: 10000 });
                    else messageService.add({ severity: 'error', summary: 'Error', detail: error.error.message, life: 10000 });
                }
                else if (error.statusText){
                    messageService.add({ severity: 'error', summary: 'Error', detail: error.statusText, life: 10000 });
                }
            }
            return throwError(() => error);
        })
    );
};
