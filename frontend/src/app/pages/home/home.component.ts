import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthHelperService } from '../../services/auth-helper.service';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';
import { UserResponseDTO } from '../../api';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [],
})
export class HomeComponent implements OnInit {
  private authHelperService = inject(AuthHelperService);
  private authService = inject(AuthService);
  private navigationService = inject(NavigationService);

  greetingMessage: string = '';
  // Auth0 user observable
  auth0User$ = this.authService.user$;

  user = this.authHelperService.user;

  ngOnInit() {
    this.greetingMessage = this.getGreetingMessage();

    // this.auth0User$.pipe(take(1)).subscribe({
    //   next: (u) => {
    //     console.log('Auth0 User:', u);
    //     if (u) {
    //       localStorage.setItem('user', JSON.stringify(u));
    //     }
    //     const cacheUser = localStorage.getItem('user');
    //     console.log('Cached User from localStorage:', cacheUser);
    //   },
    // });
  }

  private getGreetingMessage(): string {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Good morning,';
    } else if (currentHour < 18) {
      return 'Good afternoon,';
    } else {
      return 'Good evening,';
    }
  }

  navigateTo(url: string) {
    this.navigationService.navigateTo(url);
  }
}
