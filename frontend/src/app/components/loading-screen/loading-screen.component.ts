import { Component, inject, Input, OnInit } from '@angular/core';
import { LoadingScreenService } from '../../services/loading-screen.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {

  private loadingService = inject(LoadingScreenService);
  isLoading = this.loadingService.loading;

  @Input() customMessage: string = 'Loading';

  ngOnInit() {
    this.loadingService.setLoading(true);
  }

  toggleLoading() {
    this.loadingService.setLoading(!this.isLoading());
  }

}
