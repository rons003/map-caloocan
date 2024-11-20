import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { API_BASE_URL } from './services/api.service';
import { environment } from '../environments/environment.development';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), {
    provide: API_BASE_URL,
    useFactory: () => {
      return environment.API_BASE_URL;
    }
  }]
};
