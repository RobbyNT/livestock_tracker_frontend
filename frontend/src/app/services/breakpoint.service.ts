import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private destroyRef = inject(DestroyRef);

  private readonly breakpoints = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1535px)',
  };

  private createBreakpointSignal(query: string) {
    const mediaQuery = window.matchMedia(query);
    const _signal = signal(mediaQuery.matches);

    fromEvent(mediaQuery, 'change')
      .pipe(
        map(() => mediaQuery.matches),
        startWith(mediaQuery.matches),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (matches) => _signal.set(matches),
      });
    return _signal.asReadonly();
  }

  readonly isSm = this.createBreakpointSignal(this.breakpoints.sm);
  readonly isMd = this.createBreakpointSignal(this.breakpoints.md);
  readonly isLg = this.createBreakpointSignal(this.breakpoints.lg);
  readonly isXl = this.createBreakpointSignal(this.breakpoints.xl);
  readonly is2Xl = this.createBreakpointSignal(this.breakpoints['2xl']);

  // Computed convenience properties
  readonly isMobile = computed(() => !this.isMd());
  readonly isTablet = computed(() => this.isMd() && !this.isLg());
  readonly isDesktop = computed(() => this.isLg());

  // Current breakpoint name
  readonly currentBreakpoint = computed(() => {
    if (this.is2Xl()) return '2xl';
    if (this.isXl()) return 'xl';
    if (this.isLg()) return 'lg';
    if (this.isMd()) return 'md';
    if (this.isSm()) return 'sm';
    return 'xs';
  });

  // Check specific breakpoint
  isBreakpoint(breakpoint: keyof typeof this.breakpoints): boolean {
    return window.matchMedia(this.breakpoints[breakpoint]).matches;
  }
}
