import { Component, inject, OnInit } from '@angular/core';
import { AuthHelperService } from '../../../services/auth-helper.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  imports: [
    NgOptimizedImage
  ],
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  private authHelperService = inject(AuthHelperService);
  user = this.authHelperService.user;

  ngOnInit() {
  }

}
