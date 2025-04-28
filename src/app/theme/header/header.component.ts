import { Component, EventEmitter, Output , OnInit, HostListener } from '@angular/core';
import { ThemeService , Theme } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  constructor(private themeService:ThemeService){}

  currentTheme: Theme = 'system';
  sidebarVisible:boolean = true

  @Output() sidebarToggle = new EventEmitter<boolean>()

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarToggle.emit(this.sidebarVisible)
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
      console.log(this.currentTheme)
    });
    
    // Initialize with saved theme
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme) {
      this.themeService.setTheme(savedTheme);
    } else {
      this.themeService.setTheme('system');
    }
  }

  setTheme(theme: Theme): void {
    this.currentTheme = localStorage.getItem('app-theme') as Theme
    if(this.currentTheme == 'light'){
      this.themeService.setTheme('dark');
    }else{
      this.themeService.setTheme('light');
    }
  }

  getThemeIcon(): string {
    switch (this.currentTheme) {
      case 'system':
        return 'bi-circle-half';
      case 'light':
        return 'bi-sun-fill';
      case 'dark':
        return 'bi-moon-stars-fill';
      default:
        return 'bi-circle-half';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const toggleContainer = document.querySelector('.theme-toggle-container');
    
    // if (toggleContainer && !toggleContainer.contains(target)) {
    //   this.isDropdownOpen = false;
    // }
  }

}


// Add this to make TypeScript recognize the global bootstrap object
declare global {
  interface Window {
    bootstrap: any;
  }
} 