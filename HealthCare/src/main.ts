import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { NgxDaterangepickerMd, LocaleService } from 'ngx-daterangepicker-material';
import { provideRouter, withRouterConfig, RouteReuseStrategy } from '@angular/router';
import { routes } from './app/app.routes';
import { NoReuseRouteStrategy } from './app/no-reuse.strategy';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),

    // ✅ Router reload config
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),

    // ✅ Angular 18–approved reuse strategy
    {
      provide: RouteReuseStrategy,
      useClass: NoReuseRouteStrategy
    },

    // ngx daterangepicker
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
