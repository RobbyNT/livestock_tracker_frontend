import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { AuthHelperService } from '../../services/auth-helper.service';

@Component({
  selector: 'app-mobile-navigation-menu',
  templateUrl: './mobile-navigation-menu.component.html',
  styleUrls: ['./mobile-navigation-menu.component.css']
})
export class MobileNavigationMenuComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private authHelperService = inject(AuthHelperService);

  ngOnInit() {
  }

  navigateUrl(url: string) {
    this.navigationService.navigateTo(url);
  }

  logout() {
    this.authHelperService.logout();
  }

}
