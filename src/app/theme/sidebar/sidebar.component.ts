import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [TitleCasePipe , RouterLink , RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  myMenu = [
    {menu:"dashboard",icon_class:"bi bi-speedometer", menu_url:"/dashboard"},
    {menu:"client",icon_class:"bi bi-person", menu_url:"/client-master"},
    {menu:"Property",icon_class:"bi bi-people", menu_url:"/property-master"},
    {menu:"Rooms",icon_class:"bi bi-person-add", menu_url:"/rooms"},
    {menu:"Tenant",icon_class:"bi bi-person-gear", menu_url:"/tenant"},
    {menu:"setting",icon_class:"bi bi-gear", menu_url:"/dashboard2"},
  ]

}
