import { Routes } from '@angular/router';
import { Notfound } from './views/notfound/pages/notfound/notfound.js';

export const appRoutes: Routes = [
	{
		path: '',
		loadChildren: () => import('./views/landing/landing.routes')
	},
    {
        path: 'platform',
		loadChildren: () => import('./views/platform/platform.routes')
    },
	{ path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
