import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { AuthHelperService } from './services/auth-helper.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  showHeader = true;

  private readonly router = inject(Router);
  private readonly authHelperService = inject(AuthHelperService);

  async ngOnInit(): Promise<void> {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const excludedRoutes = [
          '/landing-page',
          '/login',
          '/register',
          '/multifactor-auth',
        ];
        this.showHeader = !excludedRoutes.includes(event.urlAfterRedirects);
      });
    if (this.authHelperService.user() === null) {
      await this.authHelperService.loadUser().then((u) => {
        console.log('AppComponent loaded user:', u);
      });
    }
  }
}
