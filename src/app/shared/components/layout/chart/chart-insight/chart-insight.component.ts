import { Component, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-chart-insight',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart-insight.component.html',
  styleUrl: './chart-insight.component.scss'
})
export class ChartInsightComponent implements OnInit {

  @Input() domainInfo: any;

  //charts
  timeLineChartData!: ChartConfiguration<'bar'>['data'];
  registrarChartData!: ChartConfiguration<'pie'>['data'];
  dnsSecChartData!: ChartConfiguration<'doughnut'>['data'];
  whoisUpdateChartData!: ChartConfiguration<'line'>['data'];
  // seoStatsChartData!: ChartConfiguration<'bar'>['data'];


  ngOnInit(){
    if(this.domainInfo){
      this.prepareCharts();
    }
  }

 
  prepareCharts(){
    const name = this.domainInfo.domainName || 'Unknown Domain';
    const created = new Date(this.domainInfo.createdDate);
    const expires = new Date(this.domainInfo.expiresDate);
    // const updated = new Date(this.domainInfo.updatedDate);

    const now = new Date();

    const domainAge = Math.max(0, Math.floor((now.getTime() - created.getTime())/(1000*60*60*24*365.25)));
    const timeToExpiry = Math.max(0, Math.floor((expires.getTime() - now.getTime())/(1000*60*60*24*365.25)));

    // Domain Age & Expiry chart
    this.timeLineChartData = {
      labels: ['Age', 'Time Until Expiry'],
      datasets: [{
        label: `${name} Timeline`,
        data: [domainAge, timeToExpiry],
        backgroundColor: ['#4CAF50', '#FF9800'],
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


    // WHOIS Timeline
    this.whoisUpdateChartData = {
      labels: ['Last WHOIS Update', 'REgistry Last Update'],
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


}
