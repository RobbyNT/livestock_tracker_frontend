import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthHelperService } from '../../services/auth-helper.service';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';
import { UserResponseDTO } from '../../api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [],
})
export class HomeComponent implements OnInit {
  private authHelperService = inject(AuthHelperService);
  private authService = inject(AuthService);

  // Auth0 user observable
  auth0User$ = this.authService.user$;
  // user: any = null;

  // user = this.authHelperService.user;
  user = signal<any | null>(null)

  ngOnInit() {
    this.user.set({first_name: "Robby"});

    this.auth0User$.pipe(take(1)).subscribe({
      next: (u) => {
        console.log('Auth0 User:', u);
        if (u) {
          localStorage.setItem('user', JSON.stringify(u));
        }
        const cacheUser = localStorage.getItem('user');
        console.log('Cached User from localStorage:', cacheUser);
      },
    });
  }
}
