import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthHelperService } from '../services/auth-helper.service';

export const authGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
  const authHelperService = inject(AuthHelperService);
  const router = inject(Router);

  const user = await authHelperService.loadUser();

  if (!user) {
    router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  const requiredScopes: string[] = route.data['scopes'] || [];
  const scopeCheck = authHelperService.hasScope(requiredScopes);
  const hasAccess = requiredScopes.length === 0 || scopeCheck;

  if (!hasAccess) {
    router.createUrlTree(['/unauthorized'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return hasAccess;
};
