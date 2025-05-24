import { Routes } from '@angular/router';
import { DomainHomeComponent } from './pages/domain-home/domain-home.component';

export const routes: Routes = [

    { path: '', component: DomainHomeComponent},
    { path: '**', redirectTo: ''}
];
