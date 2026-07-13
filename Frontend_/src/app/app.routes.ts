import { Routes } from '@angular/router';
import { Notfound } from './views/notfound/pages/notfound/notfound.js';
import { AppLayout } from './views/platform/layout/app.layout.js';
import { BirdsService } from './views/platform/pages/cor/services/birdsService.js';
import { RecipiesService } from './views/platform/pages/fod/services/recipiesService.js';

export const appRoutes: Routes = [
	{ path: '', loadChildren: () => import('./views/landing/landing.routes') },
    {
        path: 'platform',
        component: AppLayout,
        providers: [
			BirdsService,
			RecipiesService
        ],
		loadChildren: () => import('./views/platform/platform.routes')
    },
	{ path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
