import { Component, HostListener , OnInit } from '@angular/core';
import { HeaderComponent } from '../theme/header/header.component';
import { SidebarComponent } from '../theme/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent,SidebarComponent,RouterOutlet,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements  OnInit{

  sidebarVisible = true;
  isMobileView: boolean =false;

  ngOnInit() {
    this.checkViewport();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 768;
    console.log(this.isMobileView)
    if (this.isMobileView) {
      console.log("Mobile")
      this.sidebarVisible = false;
    }else{
      this.sidebarVisible = true;
    }
  }

  sidebarState(state: boolean) {
    this.sidebarVisible = state;
  }
  

}
