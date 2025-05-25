import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card'

@Component({
  selector: 'app-domain-details',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './domain-details.component.html',
  styleUrl: './domain-details.component.scss',
  
})
export class DomainDetailsComponent {
  @Input() domainInfo: any;

   getDomainAge(createdDateStr: string): string {
    if (!createdDateStr) return 'Unknown';
    const createdDate = new Date(createdDateStr);
    const now = new Date();
    const diff = now.getTime() - createdDate.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
    return `${years} years, ${months} months`;
  }

}
