import { Component, Inject, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { AuthHelperService } from '../../services/auth-helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [],
})
export class HeaderComponent implements OnInit {
  private navigationService = inject(NavigationService);
  checkRoute = this.navigationService.checkRoute.bind(this.navigationService);
  private authHelperService = inject(AuthHelperService);

  ngOnInit() {}

  navigateUrl(url: string) {
    this.navigationService.navigateTo(url);
  }

  logout() {
    this.authHelperService.logout();
  }
}
