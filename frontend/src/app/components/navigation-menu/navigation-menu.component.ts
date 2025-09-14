import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {
  }

  navigateUrl(url: string) {
    this.navigationService.navigateTo(url);
  }

}
