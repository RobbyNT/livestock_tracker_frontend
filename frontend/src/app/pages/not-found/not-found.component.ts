import { Component, inject, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  private navService = inject(NavigationService);

  ngOnInit() {
  }

  navigateUrl(url: string) {
    this.navService.navigateTo(url);
  }

}
