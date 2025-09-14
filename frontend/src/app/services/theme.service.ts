import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly _darkMode = signal<boolean>(false);
  darkMode = computed(() => this._darkMode());

  constructor() {
    let isDarkMode = localStorage.getItem('theme') === 'dark';
    this.setTheme(isDarkMode);
  }

  setTheme(darkMode: boolean) {
      if (darkMode) {
        this.document.body.classList.add('dark');
        this.document.body.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      } else {
        this.document.body.classList.add('light');
        this.document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      this._darkMode.set(darkMode);
    }

  toggleDarkMode() {
    this.setTheme(!this.darkMode());
  }
}
