import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'system' | 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storageKey = 'app-theme';
  private darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
  private themeSource = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$ = this.themeSource.asObservable();
  public isDarkMode$ = new BehaviorSubject<boolean>(this.isDarkMode());

  constructor() {
    // Watch for system theme changes
    this.darkThemeMq.addEventListener('change', () => {
      if (this.themeSource.value === 'system') {
        this.isDarkMode$.next(this.isDarkMode());
        this.applyTheme();
      }
    });

    // Apply initial theme
    this.applyTheme();
  }

  private getInitialTheme(): Theme {
    return (localStorage.getItem(this.storageKey) as Theme) || 'system';
  }

  setTheme(theme: Theme): void {
    this.themeSource.next(theme);
    localStorage.setItem(this.storageKey, theme);
    this.isDarkMode$.next(this.isDarkMode());
    this.applyTheme();
  }

  private isDarkMode(): boolean {
    const current = this.themeSource.value;
    return current === 'dark' || (current === 'system' && this.darkThemeMq.matches);
  }

  private applyTheme(): void {
    const isDark = this.isDarkMode();
    const root = document.documentElement;

    // Apply Bootstrap theme
    root.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');

    // Optional: Add a theme class to body (for your own CSS)
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
  }
}
