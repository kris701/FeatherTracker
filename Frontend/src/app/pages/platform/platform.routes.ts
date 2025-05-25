import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor.interceptor';
import { UserInterface } from './interfaces/usersinterface';

export default [
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes'),
        providers: [provideHttpClient()]
    },
    {
        path: '',
        component: AppLayout,
        providers: [provideHttpClient(withInterceptors([authInterceptor])), UserInterface],
        children: [
            { path: '', component: Dashboard },
            { path: 'core', loadChildren: () => import('./pages/core/core.routes') },
        ]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
