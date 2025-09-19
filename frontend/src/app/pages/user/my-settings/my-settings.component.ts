import { Component, inject, OnInit } from '@angular/core';
import { AuthHelperService } from '../../../services/auth-helper.service';

@Component({
  selector: 'app-my-settings',
  templateUrl: './my-settings.component.html',
  styleUrls: ['./my-settings.component.css']
})
export class MySettingsComponent implements OnInit {

  private authHelperService = inject(AuthHelperService);
  user = this.authHelperService.user;

  ngOnInit() {
  }

}
