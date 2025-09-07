import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
  checkRoute(url: string): boolean {
    const excludedRoutes = ['/landing-page', '/login', '/register', '/home'];
    console.log(url);
    return !excludedRoutes.includes(url);
  }
}
