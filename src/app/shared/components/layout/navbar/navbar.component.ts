import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { WINDOW } from './window.token';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatToolbar, MatIcon, MatButtonModule, MatSidenavModule, MatListModule, MatDividerModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isDarkMode: boolean = false;
  isMobile: boolean = false;
  drawerOpened: boolean = false;

constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window: Window) {
  const defaultTheme = this.isDarkMode ? 'dark-theme' : 'light-theme';
  this.renderer.addClass(document.body, defaultTheme);
  this.isMobile = false;
}

 ngOnInit() {
      this.checkViewport();
  }

  toggleDarkMode(){
    this.isDarkMode = !this.isDarkMode;
    const addClass = this.isDarkMode ? 'dark-theme' : 'light-theme';
    const removeClass = this.isDarkMode ? 'light-theme' : 'dark-theme';
    this.renderer.removeClass(document.body, removeClass);
    this.renderer.addClass(document.body, addClass);

  }

@HostListener('window:resize', [])
onResize() {
  this.checkViewport();
}

checkViewport() {
  const mobile = window.innerWidth <= 768;
  if (!mobile && this.drawerOpened) {
    this.drawerOpened = false;
  }
  this.isMobile = mobile;
}


  toggleDrawer(){
    this.drawerOpened = !this.drawerOpened;
  }

  closeDrawer(){
    this.drawerOpened = false;
    
    if (this.isMobile) {
    this.drawerOpened = false;
    }
  }



}
