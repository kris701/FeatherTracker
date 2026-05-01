import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { LandingPage } from './pages/main/setup.main';

export default [
    {
        path: '',
        component: AppLayout,
        providers: [provideHttpClient()],
        children: [
            { path: '', component: LandingPage }
        ]
    }
] as Routes;
