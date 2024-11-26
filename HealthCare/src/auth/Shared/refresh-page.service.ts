import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshPageService {
  
  private refreshNeeded = new Subject<void>();
  
  constructor() { }
   // Observable stream for subscribers
   refreshNeeded$ = this.refreshNeeded.asObservable();

  // Method to call when popup data is submitted
  notifyRefresh() {
    debugger;
    this.refreshNeeded.next();
  }

}
