import { Component, ViewEncapsulation } from '@angular/core';
import {
  RouterOutlet,
  RouterModule,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event
} from '@angular/router';
import { NavbarComponent } from './shared/components/layout/navbar/navbar.component';

import { CommonModule } from '@angular/common';
import { FooterComponent } from "./shared/components/layout/footer/footer.component";
import { DomainService } from './core/services/domain.service';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, RouterModule, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DomainService]
})
export class AppComponent {
  title = 'Domain Insight';
  loading$ = this.domainService.loading$;
  isLoading = false;

  constructor(private router: Router, private domainService: DomainService, private http: HttpClientModule) {}

  ngOnInit() {
    const loader = document.getElementById('global-loader');
    if (loader) {
       loader.style.display = 'none';
    }

    setTimeout(() => {
      this.domainService.hide();
    }, 1500);  
  }
}
