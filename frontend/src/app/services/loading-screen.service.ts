import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {

  private readonly _loading = signal<boolean>(false);
  loading = computed(() => this._loading());

  setLoading(flag: boolean) {
    this._loading.set(flag);
  }

}
