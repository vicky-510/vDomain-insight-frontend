import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'
import { MatToolbar } from '@angular/material/toolbar'
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatToolbar, MatIcon, MatButtonModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isDarkMode = true;

  constructor(private renderer: Renderer2){}

  toggleDarkMode(){
    this.isDarkMode = !this.isDarkMode;
    
  }

}
