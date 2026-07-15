import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { SetupPage } from './pages/main/setup.main';

export default [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: SetupPage }
        ]
    }
] as Routes;
