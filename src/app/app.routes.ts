import { Routes } from '@angular/router';
import { DomainHomeComponent } from './pages/domain-home/domain-home.component';
import { AboutComponent } from './pages/about/about.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: DomainHomeComponent },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
   {
    path: 'contact',
    component: ContactComponent,
  },
  { path: '**', redirectTo: '' },
];
