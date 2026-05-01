import { Routes } from '@angular/router';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: 'platform',
        loadChildren: () => import('./app/pages/platform/platform.routes')
    },
    {
        path: '',
        loadChildren: () => import('./app/pages/landing/landing.routes')
    },
    {
        path: 'setup',
        loadChildren: () => import('./app/pages/setup/setup.routes')
    },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
