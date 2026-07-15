import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { AuthLogin } from './pages/auth/auth.login';
import { LandingPage } from './pages/main/landing.main';

export default [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: LandingPage },
            { path: 'auth', component: AuthLogin },
        ]
    }
] as Routes;
