import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  private navigationService = inject(NavigationService);

  ngOnInit() {}

  navigateToLogin() {
    this.navigationService.navigateTo('/login');
  }
}
