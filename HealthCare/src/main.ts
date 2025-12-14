import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { NgxDaterangepickerMd, LocaleService } from 'ngx-daterangepicker-material';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),

    // ✅ THIS IS THE KEY FIX
    importProvidersFrom(
      NgxDaterangepickerMd.forRoot({
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        format: 'DD-MMM-YYYY',
        firstDay: 1
      })
    ),

    // ✅ REQUIRED
    LocaleService
  ]
}).catch(err => console.error(err));





