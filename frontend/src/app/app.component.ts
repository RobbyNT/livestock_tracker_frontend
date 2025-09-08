import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthHelperService } from './services/auth-helper.service';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';

  private readonly authHelperService = inject(AuthHelperService);
  private readonly navigationService = inject(NavigationService);

  showHeader = this.navigationService.showHeader;

  async ngOnInit(): Promise<void> {
    if (this.authHelperService.user() === null) {
      await this.authHelperService.loadUser().then((u) => {
        console.log('AppComponent loaded user:', u);
      });
    }
  }
}
