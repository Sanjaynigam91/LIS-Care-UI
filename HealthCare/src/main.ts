import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { NgxDaterangepickerMd, LocaleService } from 'ngx-daterangepicker-material';
import { provideRouter, withRouterConfig, RouteReuseStrategy } from '@angular/router';
import { routes } from './app/app.routes';
import { NoReuseRouteStrategy } from './app/no-reuse.strategy';


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/authorize.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),

    // ✅ Enable HttpClient + DI-based interceptors
    provideHttpClient(
      withInterceptorsFromDi()
    ),

    // ✅ Register class-based interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // Router
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),

    {
      provide: RouteReuseStrategy,
      useClass: NoReuseRouteStrategy
    },

    importProvidersFrom(
      NgxDaterangepickerMd.forRoot({
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        format: 'DD-MMM-YYYY',
        firstDay: 1
      })
    ),

    LocaleService
  ]
}).catch(err => console.error(err));
