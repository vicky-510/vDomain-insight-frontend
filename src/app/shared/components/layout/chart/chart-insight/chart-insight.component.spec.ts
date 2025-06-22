import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartInsightComponent } from './chart-insight.component';

describe('ChartInsightComponent', () => {
  let component: ChartInsightComponent;
  let fixture: ComponentFixture<ChartInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartInsightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
