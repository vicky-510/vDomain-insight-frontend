import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insight-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './insight-filter.component.html',
  styleUrl: './insight-filter.component.scss'
})
export class InsightFilterComponent {
 
  @Input() selected: 'all' | 'statistical' | 'visual' = 'all';
  @Output() filterChange = new EventEmitter<'all' | 'statistical' | 'visual'>();

  onSelect(type: 'all' | 'statistical' | 'visual'): void {
    this.selected = type;
    this.filterChange.emit(type);
  }



}
