import { computed, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
  private readonly _isDarkMode = signal(false);
  isDarkMode = computed(() => this._isDarkMode());

  setTheme(theme: 'dark' | 'light') {
    this._isDarkMode.set(theme === 'dark');
  }

  toggleTheme() {
    this._isDarkMode.set(!this.isDarkMode());
  }
}
