import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Routes } from '@angular/router';
import { authInterceptor } from './auth-interceptor.interceptor';
import { AppLayout } from './layout/app.layout';
import { Dashboard } from './pages/dsh/dsh';
import { BirdsService } from './services/birdsService';
import { RecipiesService } from './services/recipiesService';

export default [
    {
        path: '',
        component: AppLayout,
        providers: [provideHttpClient(withInterceptors([authInterceptor])), BirdsService, RecipiesService],
        children: [
            { path: '', component: Dashboard },
            { path: 'COR', loadChildren: () => import('./pages/cor/cor.routes') },
            { path: 'WGT', loadChildren: () => import('./pages/wgt/wgt.routes') },
            { path: 'FOD', loadChildren: () => import('./pages/fod/fod.routes') },
        ]
    }
] as Routes;
