import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthHelperService } from '../services/auth-helper.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private authHelperService = inject(AuthHelperService);
  private router = inject(Router);

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = await this.authHelperService.loadUser();

    if (!user) {
      await this.router.navigate(['/login']);
      return false;
    }

    const requiredScopes: string[] = route.data['scopes'] || [];
    const scopeCheck = this.authHelperService.hasScope(requiredScopes);
    const hasAccess = requiredScopes.length === 0 || scopeCheck;

    if (!hasAccess) {
      await this.router.navigate(['/unauthorized']);
    }

    return hasAccess;
  }
}
