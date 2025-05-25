import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-domain-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './domain-card.component.html',
  styleUrl: './domain-card.component.scss'
})
export class DomainCardComponent {
       @Input() domainInfo: any;
    domainDetails: any[] = [];

    ngOnChanges(changes: SimpleChanges): void { // Ensure ngOnChanges takes SimpleChanges
      if (changes['domainInfo'] && this.domainInfo) {
        this.domainDetails = this.mapDomainInfoToCards(changes['domainInfo'].currentValue);
      }
    }

    // Helper to format dates
    formatDate(dateString: string | null): string {
      if (!dateString || dateString === 'N/A') return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        console.error('Error parsing date:', dateString, e);
        return 'Invalid Date';
      }
    }

    getDomainAge(createdDateStr: string): string {
      if (!createdDateStr || createdDateStr === 'N/A') return 'N/A';
      try {
        const createdDate = new Date(createdDateStr);
        const now = new Date();
        // Calculate difference in milliseconds
        const diff = now.getTime() - createdDate.getTime();

        // Calculate years and months
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const remainingMillis = diff % (1000 * 60 * 60 * 24 * 365.25);
        const months = Math.floor(remainingMillis / (1000 * 60 * 60 * 24 * 30.44)); // Average days in a month

        if (years === 0 && months === 0) {
            // For very new domains or if the creation date is in the future (error)
            if (diff < 0) return 'Future Date';
            return 'Less than a month';
        }
        return `${years} years, ${months} months`;
      } catch (e) {
        console.error('Error calculating domain age:', createdDateStr, e);
        return 'N/A';
      }
    }

    private mapDomainInfoToCards(info: any): { icon: string; title: string; value: string }[] {
        // Ensure info is an object before proceeding
        if (!info || typeof info !== 'object') {
            return [{ icon: 'error', title: 'Error', value: 'No domain data available.' }];
        }

        const details = [];

        // --- Core Domain Information ---
        details.push(
            { icon: 'language', title: 'Domain Name', value: info.domainName || 'N/A' },
            { icon: 'extension', title: 'Extension', value: info.domainNameExt || 'N/A' },
            { icon: 'calendar_today', title: 'Domain Age', value: this.getDomainAge(info.createdDate) },
            { icon: 'event', title: 'Creation Date', value: this.formatDate(info.createdDate) },
            { icon: 'event_available', title: 'Expiry Date', value: this.formatDate(info.expiresDate) },
            { icon: 'update', title: 'Last Updated (Domain)', value: this.formatDate(info.updatedDate) },
            { icon: 'check_circle', title: 'Domain Status', value: Array.isArray(info.status) ? info.status.join(', ') : (info.status || 'N/A') }
        );

        // --- Registrar Information ---
        details.push(
            { icon: 'apartment', title: 'Registrar Name', value: info.registrarName || 'N/A' },
            { icon: 'badge', title: 'Registrar IANA ID', value: info.registrarIANAID || 'N/A' },
            { icon: 'web', title: 'Registrar URL', value: info.registrarURL || 'N/A' },
            { icon: 'dns', title: 'Registrar WHOIS Server', value: info.registrarWhoisServer || 'N/A' },
            { icon: 'email', title: 'Registrar Abuse Email', value: info.contactEmail || 'N/A' }
        );

        // --- Registrant Contact ---
        details.push(
            { icon: 'person', title: 'Registrant Org', value: info.registrant?.organization || 'N/A' },
            { icon: 'email', title: 'Registrant Email', value: info.registrant?.email || 'Protected/N/A' },
            { icon: 'flag', title: 'Registrant Country', value: info.registrant?.country || 'N/A' },
            { icon: 'flag', title: 'Registrant Country Code', value: info.registrant?.countryCode || 'N/A' },
            { icon: 'location_city', title: 'Registrant State', value: info.registrant?.state || 'N/A' }
        );

        // --- Administrative Contact (optional, often same as registrant) ---
        if (info.administrativeContact?.organization && info.administrativeContact.organization !== info.registrant?.organization) {
            details.push(
                { icon: 'account_box', title: 'Admin Org', value: info.administrativeContact?.organization || 'N/A' },
                { icon: 'email', title: 'Admin Email', value: info.administrativeContact?.email || 'Protected/N/A' }
            );
        }

        // --- Technical Contact (optional, often same as registrant) ---
        if (info.technicalContact?.organization && info.technicalContact.organization !== info.registrant?.organization) {
            details.push(
                { icon: 'build', title: 'Tech Org', value: info.technicalContact?.organization || 'N/A' },
                { icon: 'email', title: 'Tech Email', value: info.technicalContact?.email || 'Protected/N/A' }
            );
        }

        // --- Name Servers ---
        details.push(
            { icon: 'public', title: 'Name Servers', value: info.nameServers?.join(', ') || 'N/A' },
            { icon: 'router', title: 'Name Server IPs', value: info.nameServerIPs?.join(', ') || 'N/A' }
        );

        // --- Security ---
        details.push(
            { icon: 'security', title: 'DNSSEC Status', value: info.dnssec || 'N/A' }
        );

        // --- Audit Dates from API ---
        details.push(
            { icon: 'history', title: 'API Data Last Updated', value: this.formatDate(info.lastWhoisUpdate) },
            { icon: 'data_usage', title: 'Registry Data Updated (API)', value: this.formatDate(info.registryLastUpdate) }
        );

        return details;
    }



// domainDetails = [
//   // Core Info
//   { icon: 'language', title: 'Domain Name', value: 'example.com' },
//   { icon: 'calendar_today', title: 'Domain Age', value: '3 years' },
//   { icon: 'calendar_today', title: 'Creation Date', value: '24/05/2001' },
//   { icon: 'calendar_today', title: 'Expiry Date', value: '24/05/2101' },
//   { icon: 'update', title: 'Last Updated', value: 'May 2024' },
//   { icon: 'info', title: 'Domain Status', value: 'active' },

//   // Registrar / Ownership
//   { icon: 'apartment', title: 'Registrar', value: 'Namecheap Inc.' },
//   { icon: 'public', title: 'Registrar URL', value: 'https://www.namecheap.com' },
//   { icon: 'email', title: 'Registrar Email', value: 'support@namecheap.com' },
//   { icon: 'phone', title: 'Registrar Phone', value: '+1.5555555555' },
//   { icon: 'email', title: 'Registrant Email', value: 'dummy@gmail.com' },
//   { icon: 'phone', title: 'Registrant Phone', value: '+91 8189950272' },

//   // Hosting & DNS
//   { icon: 'dns', title: 'Nameservers', value: 'ns1.example.com, ns2.example.com' },
//   { icon: 'dns', title: 'Hostname', value: 'ns2.amzndns.net' },
//   { icon: 'public', title: 'IP Address', value: '192.0.2.123' },
//   { icon: 'cloud', title: 'Hosting Provider', value: 'AWS' },
//   { icon: 'badge', title: 'ASN', value: 'AS16509 (Amazon)' },
//   { icon: 'flag', title: 'Country', value: 'United States' },
//   { icon: 'location_city', title: 'City', value: 'New York' },
//   { icon: 'map', title: 'Region', value: 'NY' },
//   { icon: 'public', title: 'Continent', value: 'North America' },
//   { icon: 'swap_horiz', title: 'Reverse DNS', value: 'ec2-192-0-2-123.compute.amazonaws.com' },

//   // Email & Security
//   { icon: 'mark_email_read', title: 'SPF Record', value: 'v=spf1 include:_spf.google.com ~all' },
//   { icon: 'mail', title: 'MX Records', value: 'ASPMX.L.GOOGLE.COM' },

//   // SSL
//   { icon: 'lock', title: 'SSL Status', value: 'Valid' },
//   { icon: 'verified_user', title: 'SSL Issuer', value: 'Let\'s Encrypt' },
//   { icon: 'event_busy', title: 'SSL Expiry', value: '12/12/2025' },

//   // Web Behavior
//   { icon: 'redo', title: 'Redirected URL', value: 'https://example.com/home' },
//   { icon: 'title', title: 'Page Title', value: 'Example Domain' },

//   // SEO / Analytics
//   { icon: 'visibility', title: 'Indexed Pages', value: '1,240' },
//   { icon: 'search', title: 'Alexa Rank', value: '#142,315' }
// ];



}
