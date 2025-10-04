import { computed, Injectable, signal } from '@angular/core';
import { LoadingState } from '../components/dynamic-form/models/caching/loading-state';
import { CacheConfig, CacheKey } from '../models/tenant/cache';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private readonly DEFAULT_TTL = 5 * 60 * 1000;
  private readonly cache = new Map<string, LoadingState<any>>();
  private readonly signals = new Map<string, any>();

  getSignal<T>(cacheKey: CacheKey): {
    data: () => T | null;
    loading: () => boolean;
    error: () => string | null;
    lastUpdated: () => number | null;
  } {
    const key = this.generateKey(cacheKey);

    if (!this.signals.has(key)) {
      const initialState: LoadingState<T> = {
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
      };

      const stateSignal = signal<LoadingState<T>>(initialState);
      this.cache.set(key, initialState);
      this.signals.set(key, stateSignal);
    }

    const stateSignal = this.signals.get(key);

    return {
      data: computed(() => stateSignal().data),
      loading: computed(() => stateSignal().loading),
      error: computed(() => stateSignal().error),
      lastUpdated: computed(() => stateSignal().lastUpdated),
    };
  }

  load<T>(
    cacheKey: CacheKey,
    dataFetcher: () => Observable<T>,
    config: CacheConfig = {}
  ): void {
    const key = this.generateKey(cacheKey);
    const ttl = config.ttl ?? this.DEFAULT_TTL;
    const staleWhileRevalidate = config.staleWhileRevalidate ?? false;

    const currentState = this.cache.get(key);
    const stateSignal = this.signals.get(key);

    if (!stateSignal) {
      throw new Error(
        `Signal not initialized for key: ${key}. Call getSignal() first.`
      );
    }

    if (
      currentState?.data &&
      currentState.lastUpdated &&
      Date.now() - currentState.lastUpdated < ttl
    )
      return;

    if (currentState?.loading) return;

    const showLoading = !(staleWhileRevalidate && currentState?.data);

    if (showLoading) {
      this.updateState(key, stateSignal, {
        loading: true,
        error: null,
      });
    }

    dataFetcher()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.updateState(key, stateSignal, {
            loading: false,
            error: this.handleError(error),
          });
          return EMPTY;
        }),
        finalize(() => {
          if (showLoading) {
            this.updateState(key, stateSignal, {
              loading: false,
            });
          }
        })
      )
      .subscribe({
        next: (data) => {
          this.updateState(key, stateSignal, {
            data,
            error: null,
            lastUpdated: Date.now(),
            loading: false,
          });
        },
      });
  }

  refresh<T>(
    cacheKey: CacheKey,
    dataFetcher: () => Observable<T>,
    config: CacheConfig = {}
  ): void {
    const key = this.generateKey(cacheKey);
    const currentState = this.cache.get(key);

    if (currentState) {
      const stateSignal = this.signals.get(key);
      this.updateState(key, stateSignal, { lastUpdated: null });
    }

    this.load(cacheKey, dataFetcher, config);
  }

  getCachedData<T>(cacheKey: CacheKey): T | null {
    const key = this.generateKey(cacheKey);
    return this.cache.get(key)?.data ?? null;
  }

  isStale(cacheKey: CacheKey, ttl?: number): boolean {
    const key = this.generateKey(cacheKey);
    const state = this.cache.get(key);
    const cacheTtl = ttl ?? this.DEFAULT_TTL;

    if (!state?.lastUpdated) return true;

    return Date.now() - state.lastUpdated > cacheTtl;
  }

  invalidate(cacheKey: CacheKey | string): void {
    if (typeof cacheKey === 'string') {
      const pattern = new RegExp(cacheKey.replace('*', '.*'));
      for (const [key, signal] of this.signals) {
        if (pattern.test(key)) {
          this.updateState(key, signal, { lastUpdated: null });
        }
      }
    } else {
      const key = this.generateKey(cacheKey);
      const stateSignal = this.signals.get(key);
      if (stateSignal) {
        this.updateState(key, stateSignal, { lastUpdated: null });
      }
    }
  }

  clearAll(): void {
    this.cache.clear();
    this.signals.clear();
  }

  getStats(): {
    totalEntries: number;
    freshEntries: number;
    staleEntries: number;
  } {
    const now = Date.now();
    let freshEntries = 0;
    let staleEntries = 0;

    for (const state of this.cache.values()) {
      if (state.lastUpdated) {
        if (now - state.lastUpdated < this.DEFAULT_TTL) {
          freshEntries ++;
        } else {
          staleEntries ++;
        }
      } else {
        staleEntries ++;
      }
    }
    return {
      totalEntries: this.cache.size,
      freshEntries,
      staleEntries
    }
  }

  private generateKey(cacheKey: CacheKey): string {
    const { scope, identifier, params } = cacheKey;
    let key = scope;

    if (identifier !== undefined) {
      key += `:${identifier}`;
    }

    if (params && Object.keys(params).length > 0) {
      const sortedParams = Object.keys(params)
        .sort()
        .map((k) => `${key}=${JSON.stringify(params[k])}`)
        .join('&');
      key += `?${sortedParams}`;
    }
    return key;
  }

  private updateState(
    key: string,
    stateSignal: any,
    updates: Partial<LoadingState<any>>
  ): void {
    const currentState = this.cache.get(key) || {
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    };

    const newState = { ...currentState, ...updates };
    this.cache.set(key, newState);
    stateSignal.set(newState);
  }

  private handleError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Network error. Please check your connection.';
    }
    return error.error?.message || `Server error: ${error.status}`;
  }
}
