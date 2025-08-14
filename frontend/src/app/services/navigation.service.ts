import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
