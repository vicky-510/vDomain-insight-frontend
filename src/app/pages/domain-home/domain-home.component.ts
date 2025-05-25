import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../../shared/components/form/search-form/search-form.component';
import { DomainDetailsComponent } from '../../shared/components/details-page/domain-details/domain-details.component';
import { HttpClientModule } from '@angular/common/http';
import { DomainService } from '../../core/services/domain.service';
import { NavbarComponent } from '../../shared/components/layout/navbar/navbar.component';

@Component({
  selector: 'app-domain-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SearchFormComponent, DomainDetailsComponent, NavbarComponent],
  templateUrl: './domain-home.component.html',
  styleUrl: './domain-home.component.scss',
  providers: [DomainService],
})
export class DomainHomeComponent {
  domainData: any;

  constructor(private api: DomainService) {}

  handleSearch(domain: string) {
    if (domain?.trim()) {
      this.api.getDomainDetails(domain).subscribe({
        next: (data: any) => {
          this.domainData = data?.vwaran_API?.WhoisRecord;
          // console.log('domain data', this.domainData);
        },
        error: (err: any) => console.error(err),
      });
    }
  }
}
