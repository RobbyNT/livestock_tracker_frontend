import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { AuthHelperService } from '../../services/auth-helper.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [],
})
export class HeaderComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private authHelperService = inject(AuthHelperService);

  showHeader = this.navigationService.showHeader;

  ngOnInit() {
  }

  navigateUrl(url: string) {
    this.navigationService.navigateTo(url);
  }

  logout() {
    this.authHelperService.logout();
  }
}
