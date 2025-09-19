import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthHelperService } from './services/auth-helper.service';
import { NavigationService } from './services/navigation.service';
import { MobileNavigationMenuComponent } from "./components/mobile-navigation-menu/mobile-navigation-menu.component";
import { BreakpointService } from './services/breakpoint.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MobileNavigationMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';

  private readonly authHelperService = inject(AuthHelperService);
  private readonly navigationService = inject(NavigationService);
  protected breakpointService = inject(BreakpointService);

  showHeader = this.navigationService.showHeader;
  showNavMenu = this.navigationService.showNavMenu;

  async ngOnInit(): Promise<void> {
    if (this.authHelperService.user() === null) {
      await this.authHelperService.loadUser().then((u) => {
        console.log('AppComponent loaded user:', u);
      });
    }
  }
}
