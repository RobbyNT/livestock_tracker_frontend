import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { AuthHelperService } from '../../services/auth-helper.service';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NavigationMenuComponent],
})
export class HeaderComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private authHelperService = inject(AuthHelperService);
  private themeService = inject(ThemeService);

  showHeader = this.navigationService.showHeader;
  showNavMenu = this.navigationService.showNavMenu;
  darkMode = this.themeService.darkMode;

  ngOnInit() {}

  navigateUrl(url: string) {
    this.navigationService.navigateTo(url);
  }

  logout() {
    this.authHelperService.logout();
  }

  toggleNavMenu() {
    this.navigationService.setShowNavMenu(
      !this.navigationService.showNavMenu()
    );
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
