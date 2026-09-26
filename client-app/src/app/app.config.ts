import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';
import { hotelContextInterceptor } from './core/interceptors/hotel-context.interceptor';
import { companyContextInterceptor } from './core/interceptors/company-context.interceptor';

// Exported for services that need the base API URL
//export const apiBaseUrl = 'http://localhost:3000/api';

export const apiBaseUrl = 'http://localhost:5287/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptors([authInterceptor, companyContextInterceptor, hotelContextInterceptor]))
  ]
};
