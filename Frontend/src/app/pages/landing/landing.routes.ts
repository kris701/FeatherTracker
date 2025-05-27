import { Routes } from '@angular/router';
import { LandingPage } from './pages/main/landing.main';
import { provideHttpClient } from '@angular/common/http';
import { AppLayout } from './layout/app.layout';

export default [
    {
        path: '',
        component: AppLayout,
        providers: [provideHttpClient()],
        children: [
            { path: '', component: LandingPage },
        ]
    }
] as Routes;
