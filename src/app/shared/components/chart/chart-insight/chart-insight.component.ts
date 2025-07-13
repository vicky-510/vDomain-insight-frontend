import { Component, Input, Output, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';


type ChartUnion =
  | { header: string; type: 'bar'; data: () => ChartData<'bar'> }
  | { header: string; type: 'pie'; data: () => ChartData<'pie'> }
  | { header: string; type: 'doughnut'; data: () => ChartData<'doughnut'> }
  | { header: string; type: 'line'; data: () => ChartData<'line'> };
  
@Component({
  selector: 'app-chart-insight',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart-insight.component.html',
  styleUrl: './chart-insight.component.scss'
})
export class ChartInsightComponent implements OnInit {

  @Input() domainInfo: any;
  showAll: boolean = false;
  initialLimit: number = 3;
  

  //charts
  timeLineChartData!: ChartConfiguration<'bar'>['data'];
  registrarChartData!: ChartConfiguration<'pie'>['data'];
  dnsSecChartData!: ChartConfiguration<'doughnut'>['data'];
  whoisUpdateChartData!: ChartConfiguration<'line'>['data'];
  contactCountryChartData!: ChartConfiguration<'bar'>['data'];
  nameServerChartData!: ChartConfiguration<'bar'>['data'];
  // seoStatsChartData!: ChartConfiguration<'bar'>['data'];

  chartConfig: ChartUnion[] = [
    { header: 'Domain Lifecycle', data: ()=> this.timeLineChartData, type: 'bar'},
    { header: 'Registrar Stats', data: ()=> this.registrarChartData, type: 'pie'},
    { header: 'DNSSEC Status', data: ()=> this.dnsSecChartData, type: 'doughnut'},
    { header: 'Contact Country Presence', data: ()=> this.contactCountryChartData, type: 'bar'},
    { header: 'Name Server Breakdown', data: ()=> this.nameServerChartData, type: 'bar'},
    { header: 'WHOIS Update Timeline', data: ()=> this.whoisUpdateChartData, type: 'line'},
    // { header: 'SEO Stats', data: ()=> this.seoStatsChartData, type: 'bar'},

 ];

  ngOnInit(){
    if(this.domainInfo){
      this.prepareCharts();
    }
  }

   ngOnChanges(changes: SimpleChanges) {
    if (changes['domainInfo'] && changes['domainInfo'].currentValue) {
      this.prepareCharts();
    }
  }

  toggleView() {
    this.showAll = !this.showAll;
  }

  
  get isChartData(): ChartUnion[] {
    return this.showAll ? this.chartConfig : this.chartConfig.slice(0, this.initialLimit);
  }


  getChartData(chart: any) {
  if (chart?.type === 'line' && chart?.data()) {
    const datasets = chart.data().datasets.map((ds: any) => ({
      ...ds,
      data: ds.data.map((item: any) => {
        if (typeof item === 'object' && item !== null && 'x' in item && 'y' in item) {
          return [item.x, item.y];
        }
        return item;
      })
    }));
    return { ...chart.data(), datasets };
  }
  return chart?.data();
}


 
  prepareCharts(){
    const name = this.domainInfo.domainName || 'Unknown Domain';
    const created = new Date(this.domainInfo.createdDate);
    const expires = new Date(this.domainInfo.expiresDate);
    const lastWhoisUpdate = new Date(this.domainInfo.lastWhoisUpdate || this.domainInfo.registryLastUpdate || Date.now());
    // const updated = new Date(this.domainInfo.updatedDate);

    const now = new Date();

    const domainAge = Math.max(0, Math.floor((now.getTime() - created.getTime())/(1000*60*60*24*365.25)));
    const timeToExpiry = Math.max(0, Math.floor((expires.getTime() - now.getTime())/(1000*60*60*24*365.25)));

    // Domain Age & Expiry chart
    this.timeLineChartData = {
      labels: ['Age (years)', 'Time to Expiry (years)', 'Last WHOIS Update(Days Ago)'],
      datasets: [{
        label: `${name} Timeline`,
        data: [
          this.getYearsAgo(created), 
          this.getYearsLeft(expires),
          this.getDaysAgo(lastWhoisUpdate)
        ],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
      }]
    }

    // Registrar Chart
    this.registrarChartData = {
      labels: ['Registrar', 'Others'],
      datasets: [{
        label: `Registrar: ${this.domainInfo.registrar || 'Unknown'}`,
        data: [1, 4],
        backgroundColor: ['#2196F3', '#E0E0E0'],
      }]
    }

    // DNSSEC / SSL

    const dnssecStatus = this.domainInfo.dnssec === 'unsigned' ? [0, 1]: [1, 0];
    this.dnsSecChartData = {
      labels: ['Valid DNSSEC', 'Invalid DNSSEC'],
      datasets: [{
        label: `DNSSEC Status: ${this.domainInfo.dnssec || 'Unknown'}`,
        data: dnssecStatus,
        backgroundColor: ['#4CAF50', '#F44336'],
      }]
    }

    // Contact Country Distribution
    this.contactCountryChartData = {
      labels: ['Registrant', 'Admin', 'Tech'],
      datasets: [{
        label: 'Country Code',
        data: [
          this.domainInfo.registrant.countryCode,
          this.domainInfo.administrativeContact.countryCode,
          this.domainInfo.technicalContact.countryCode
        ].map(code => code === 'N/A' ? 0 : 1), // simple presence check
        backgroundColor: ['#FFC107', '#03A9F4', '#E91E63']
      }]
    };    

    // Name Servers Chart
    this.nameServerChartData = {
      labels: this.domainInfo.nameServers,
      datasets: [{
        label: 'Name Servers',
        data: this.domainInfo.nameServers.map(() => 1),
        backgroundColor: '#607D8B'
      }]
    };

    // WHOIS Timeline
    this.whoisUpdateChartData = {
      labels: ['Last WHOIS Update', 'Registry Last Update'],
      datasets: [{
        label: 'WHOIS Updates',
        data: [
          this.convertDateToDays(this.domainInfo.lastWhoisUpdate),
          this.convertDateToDays(this.domainInfo.registryLastUpdate)
        ],
        fill: false,
        borderColor: '#FF5722',
        tension: 0.3
      }]
    }


    // // SEO Stats
    // const indexedPages = parseInt(this.domainInfo.indexedPages) || 1000;
    // const alexaRank = parseInt(this.domainInfo.alexaRank?.replace(/[^0-9]/g, '')) || 100000;

    // this.seoStatsChartData = {
    //   labels: ['Indexed Pages', 'Alexa Rank'],
    //   datasets: [{
    //     label: 'SEO Stats',
    //     data: [indexedPages, alexaRank],
    //     backgroundColor: ['#ffa726', '#8d6e63']
    //   }]
    // };

  }


  convertDateToDays(dateStr: string): number {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    } catch {
      return 0;
    }
  }

  getYearsAgo(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365));
  }  

  getYearsLeft(date: Date): number {
    return Math.max(0, Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365)));
  }  

  getDaysAgo(date: string | Date): number {
    const parsed = typeof date === 'string' ? new Date(date) : date;
    return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
  }



}
