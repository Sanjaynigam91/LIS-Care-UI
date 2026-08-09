import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import {
  NgxDaterangepickerMd,
  LocaleService
} from 'ngx-daterangepicker-material';

import {
  provideRouter,
  withRouterConfig,
  RouteReuseStrategy
} from '@angular/router';

import { routes } from './app/app.routes';
import { NoReuseRouteStrategy } from './app/no-reuse.strategy';


bootstrapApplication(AppComponent, {

  ...appConfig,

  providers: [

    ...(appConfig.providers ?? []),

    // Router
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
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

})
.catch(err => console.error(err));