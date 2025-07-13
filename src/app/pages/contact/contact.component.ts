import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, OnDestroy  {

  countdown = 10;
  intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        setTimeout(() => {
        window.location.href = 'https://vwaran.com/contact';
      }, 500);       }
    }, 1000);
  }

ngOnDestroy(): void {
  if(this.intervalId){
    clearInterval(this.intervalId);
  }
}

}
