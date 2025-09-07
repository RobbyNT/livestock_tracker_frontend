import { Component, inject, OnInit } from '@angular/core';
import { LoadingScreenService } from '../../services/loading-screen.service';
import { LoadingScreenComponent } from "../../components/loading-screen/loading-screen.component";

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css'],
  imports: [LoadingScreenComponent]
})
export class AuthCallbackComponent implements OnInit {

  private loadingService = inject(LoadingScreenService);
  isLoading = this.loadingService.loading;

  ngOnInit() {
    this.loadingService.setLoading(true);
  }

}
