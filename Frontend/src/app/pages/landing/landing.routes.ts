import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { LandingPage } from './pages/main/landing.main';

export default [
    {
        path: '',
        component: AppLayout,
        providers: [provideHttpClient()],
        children: [
            { path: '', component: LandingPage },
            {
                path: 'auth',
                loadChildren: () => import('./pages/main/auth/auth.routes'),
                providers: [provideHttpClient()]
            },
        ]
    }
] as Routes;
