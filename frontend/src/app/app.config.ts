import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Configuration } from './api';
import { ENVIRONMENT } from './environments/environment';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => {
          const modified = req.clone({ withCredentials: true });
          return next(modified);
        },
      ])
    ),
    {
      provide: Configuration,
      useValue: new Configuration({
        basePath: ENVIRONMENT.apiUrl,
        withCredentials: true,
      }),
    },
    provideAuth0({
      domain: ENVIRONMENT.auth0.domain,
      clientId: ENVIRONMENT.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ],
};
