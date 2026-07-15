// https://stackoverflow.com/questions/78822735/authorization-header-with-jwt-in-angular-to-all-requests
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TuiNotificationService } from '@taiga-ui/core';
import { catchError, throwError } from 'rxjs';

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(TuiNotificationService);
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
                localStorage.removeItem('jwtToken');
				window.location.replace('/auth?redirect=' + router.routerState.snapshot.url)
            }
            else if (error.error && error.error.details && error.error.message)
            {
                if (error.error.details && error.error.details.length < 256)
					messageService.open(error.error.details, {
						label: error.error.message,
						appearance: 'negative',
						icon:'circle-x',
						autoClose: 10000
					}).subscribe();
                else
					messageService.open(error.error.message, {
						label: "Error",
						appearance: 'negative',
						icon:'circle-x',
						autoClose: 10000
					}).subscribe();
            }
            else if (error.statusText){
				messageService.open(error.statusText, {
					label: "Error",
					appearance: 'negative',
					icon:'circle-x',
					autoClose: 10000
				}).subscribe();
            }
            return throwError(() => error);
        })
    );
};
