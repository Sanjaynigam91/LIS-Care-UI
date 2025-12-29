import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class NoReuseRouteStrategy implements RouteReuseStrategy {

  shouldDetach(): boolean {
    return false;
  }

  store(): void {}

  shouldAttach(): boolean {
    return false;
  }

  retrieve(): DetachedRouteHandle | null {
    return null;
  }

  // 👇 THIS IS THE KEY
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return false; // force reload even for same URL
  }
}
