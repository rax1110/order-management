import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes.js';
import { ErrorHandlingInterceptor } from './core/interceptors/error-handling.interceptor.js';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([
        ErrorHandlingInterceptor
      ])
    ),
  ],
};
