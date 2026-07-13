import { Routes } from '@angular/router';
import { AppLayout } from './layout/app.layout';
import { BirdsService } from './pages/cor/services/birdsService';
import { Dashboard } from './pages/dsh/dsh';
import { RecipiesService } from './pages/fod/services/recipiesService';

export default [
	{
		path: '',
		component: AppLayout,
		providers: [
			BirdsService,
			RecipiesService
		],
		children: [
			{ path: '', component: Dashboard }
		]
	},
] as Routes;
