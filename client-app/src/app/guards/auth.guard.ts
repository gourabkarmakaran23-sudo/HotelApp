import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkAccess(route, state.url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkAccess(route, state.url);
  }

  private checkAccess(route: ActivatedRouteSnapshot, url: string): boolean | Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.ensureMenuPermissionsLoaded().pipe(map(loaded => {
      if (!loaded) {
        this.router.navigate(['/login']);
        return false;
      }

      const allowedRoles = route.data['roles'] as string[] | undefined;
      if ((!allowedRoles || allowedRoles.some(role => this.authService.hasRole(role))) &&
          this.authService.canAccessRoute(url)) {
        return true;
      }

      this.router.navigate(url === '/dashboard' ? ['/login'] : ['/dashboard']);
      return false;
    }));
  }
}
