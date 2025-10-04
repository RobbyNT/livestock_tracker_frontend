import { computed, inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private readonly _showHeader = signal<boolean>(false);
  showHeader = computed(() => this._showHeader());

  private readonly _showNavMenu = signal<boolean>(false);
  showNavMenu = computed(() => this._showNavMenu());

  constructor() {
    this.updateHeaderVisibility();

    // Listens for route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateHeaderVisibility();
      });
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }

  checkRoute(url: string): boolean {
    const excludedRoutes = ['/landing-page', '/login', '/register', '/tenant/setup/create', '/tenant/setup/selection'];
    const pathname = url.split('?')[0];
    return !excludedRoutes.includes(pathname);
  }

  private updateHeaderVisibility() {
    const shouldShow = this.checkRoute(this.router.url);
    this._showHeader.set(shouldShow);
  }

  setShowNavMenu(flag: boolean) {
    this._showNavMenu.set(flag);
  }
}
