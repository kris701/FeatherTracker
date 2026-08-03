import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { EzUILayoutService } from '@kris701/ez-ui';
import { provideTaiga, tuiScrollbarOptionsProvider } from '@taiga-ui/core';
import { CategoryScale, Colors, LinearScale, LineController, LineElement, PointElement } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { provideCharts } from 'ng2-charts';
import { appHttpInterceptor } from './app.http.interceptor.ts';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
		provideHttpClient(withInterceptors([appHttpInterceptor])),
		provideRouter(appRoutes),
		provideTaiga(),
		EzUILayoutService,
		tuiScrollbarOptionsProvider({mode: 'hover'}),
		provideCharts({ registerables: [zoomPlugin, CategoryScale, LinearScale, LineController, PointElement, LineElement, Colors] })
	],
};
