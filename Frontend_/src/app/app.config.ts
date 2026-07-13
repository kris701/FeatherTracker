import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTaiga, tuiScrollbarOptionsProvider } from '@taiga-ui/core';
import { appHttpInterceptor } from './app.http.interceptor.ts';
import { appRoutes } from './app.routes';
import { LayoutService } from './common/services/layoutService';

export const appConfig: ApplicationConfig = {
  providers: [
		provideHttpClient(withInterceptors([appHttpInterceptor])),
		provideRouter(appRoutes),
		provideTaiga(),
		LayoutService,
		tuiScrollbarOptionsProvider({mode: 'hover'})
	],
};
