import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService, UserResponseDTO, UsersService } from '../api';
import { firstValueFrom, map, take, tap } from 'rxjs';
import { AuthService as AuthZeroService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthHelperService {
  private authService = inject(AuthService);
  private userService = inject(UsersService);
  private authZeroService = inject(AuthZeroService);

  private readonly _user = signal<UserResponseDTO | null>(null);
  user = computed(() => this._user());


  login(username: string, password: string) {
    return this.authService
      .loginApiV1AuthLoginPost(username, password)
      .pipe(take(1));
  }

  authZeroLogin() {
    return this.authZeroService.loginWithRedirect();
  }

  register(
    firstName: string,
    lastName: string,
    emailAddress: string,
    phoneNumber: string
  ) {
    return this.authService.registerApiV1AuthRegisterPost(
      firstName,
      lastName,
      emailAddress,
      phoneNumber
    );
  }

  async loadUser(): Promise<UserResponseDTO | null> {
    if (this._user()) {
      return this._user();
    }
    if (localStorage.getItem('user')) {
      this._user.set(JSON.parse(localStorage.getItem('user')!));
      return this._user();
    }

    try {
      const response = await firstValueFrom(
        this.userService.getMeApiV1UsersMeGet().pipe(take(1))
      );
      const user = response.data;
      this._user.set(user);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err) {
      this._user.set(null);
      return null;
    }
  }

  hasScope(scope: string[]): boolean {
    if (!this._user()) return false;

    const scopes = this._user()?.scopes?.map((s) => s.code);
    if (!scopes) return false;

    return scopes?.some((s) => scope.includes(s));
  }
}
