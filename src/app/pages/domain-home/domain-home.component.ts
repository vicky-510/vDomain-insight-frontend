import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { SearchFormComponent } from '../../shared/components/form/search-form/search-form.component';
import { DomainDetailsComponent } from '../../shared/components/details-page/domain-details/domain-details.component';
import { HttpClientModule } from '@angular/common/http';
import { DomainService } from '../../core/services/domain.service';
import { DomainCardComponent } from '../../shared/components/card/domain-card/domain-card.component';

@Component({
  selector: 'app-domain-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SearchFormComponent,
    DomainCardComponent,
  ],
  templateUrl: './domain-home.component.html',
  styleUrl: './domain-home.component.scss',
  providers: [DomainService],
})
export class DomainHomeComponent {
  domainData: any;
  isLoading = false;
  loaderSrc = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private api: DomainService,
  ) {}

  ngOnInit(): void {
    this.setLoaderBasedOnTheme();

    // watch for theme toggle
    const observer = new MutationObserver(() => {
      this.setLoaderBasedOnTheme();
    });

    observer.observe(this.document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  setLoaderBasedOnTheme(): void {
    const bodyClassList = this.document.body.classList;
    if (bodyClassList.contains('dark-theme')) {
      this.loaderSrc = '../../../assets/svg/svg_loader_search.svg';
    } else {
      this.loaderSrc = '../../../assets/svg/svg_loader_search_light.svg';
    }
  }

  handleSearch(domain: string) {
    this.isLoading = true;

    if (domain?.trim()) {
      this.api.getDomainDetails(domain).subscribe({
        next: (data: any) => {
          const whois = data?.vwaran_API?.WhoisRecord;
          this.isLoading = false;

          if (whois) {
            const registry = whois.registryData;

            this.domainData = {
              // Domain Name and Extension
              domainName: whois.domainName,
              domainNameExt: whois.domainNameExt,

              // Key Dates
              createdDate:
                registry?.createdDateNormalized || whois.createdDateNormalized,
              updatedDate:
                registry?.updatedDateNormalized || whois.updatedDateNormalized,
              expiresDate:
                registry?.expiresDateNormalized || whois.expiresDateNormalized,

              // Status
              status: registry?.status || whois.status,

              // Registrar Information
              registrarName: registry?.registrarName || whois.registrarName,
              registrarIANAID:
                registry?.registrarIANAID || whois.registrarIANAID,
              registrarWhoisServer:
                registry?.whoisServer ||
                whois.rawText?.match(/Registrar WHOIS Server: (\S+)/)?.[1] ||
                'N/A', // Extract from rawText if not directly available
              registrarURL:
                whois.rawText?.match(/Registrar URL: (\S+)/)?.[1] || 'N/A',

              registrant: {
                organization:
                  whois.registrant?.organization ||
                  registry?.registrant?.organization ||
                  'N/A',
                state:
                  whois.registrant?.state ||
                  registry?.registrant?.state ||
                  'N/A',
                country:
                  whois.registrant?.country ||
                  registry?.registrant?.country ||
                  'N/A',
                countryCode:
                  whois.registrant?.countryCode ||
                  registry?.registrant?.countryCode ||
                  'N/A',
                email:
                  this.extractEmail(whois.registrant?.rawText || '') ||
                  whois.contactEmail ||
                  'Protected/N/A',
              },
              administrativeContact: {
                organization:
                  whois.administrativeContact?.organization ||
                  registry?.administrativeContact?.organization ||
                  'N/A',
                state:
                  whois.administrativeContact?.state ||
                  registry?.administrativeContact?.state ||
                  'N/A',
                country:
                  whois.administrativeContact?.country ||
                  registry?.administrativeContact?.country ||
                  'N/A',
                countryCode:
                  whois.administrativeContact?.countryCode ||
                  registry?.administrativeContact?.countryCode ||
                  'N/A',
                email:
                  this.extractEmail(
                    whois.administrativeContact?.rawText || '',
                  ) || 'Protected/N/A',
              },
              technicalContact: {
                organization:
                  whois.technicalContact?.organization ||
                  registry?.technicalContact?.organization ||
                  'N/A',
                state:
                  whois.technicalContact?.state ||
                  registry?.technicalContact?.state ||
                  'N/A',
                country:
                  whois.technicalContact?.country ||
                  registry?.technicalContact?.country ||
                  'N/A',
                countryCode:
                  whois.technicalContact?.countryCode ||
                  registry?.technicalContact?.countryCode ||
                  'N/A',
                email:
                  this.extractEmail(whois.technicalContact?.rawText || '') ||
                  'Protected/N/A',
              },

              // Name Servers
              nameServers: registry?.nameServers?.hostNames?.length
                ? registry.nameServers.hostNames
                : whois.nameServers?.hostNames || [],
              nameServerIPs:
                registry?.nameServers?.ips || whois.nameServers?.ips || [],

              // Other Metadata
              dnssec:
                whois.rawText?.match(/DNSSEC: (\S+)/)?.[1] ||
                registry?.rawText?.match(/DNSSEC: (\S+)/)?.[1] ||
                'N/A', // Extract DNSSEC status
              estimatedDomainAge: whois.estimatedDomainAge || 'N/A',
              lastWhoisUpdate: whois.audit?.updatedDate || 'N/A',
              registryLastUpdate: registry?.audit?.updatedDate || 'N/A',
              contactEmail: whois.contactEmail || 'N/A',
            };
          } else {
            this.domainData = null;
          }
        },
        error: (err: any) => {
          console.error('Error fetching domain details:', err);
          this.domainData = null;
        },
      });
    } else {
      this.domainData = null;
    }
  }

  // Helper function to extract email from raw text
  private extractEmail(text: string): string | null {
    const match = text?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i);
    return match ? match[0] : null;
  }
}
