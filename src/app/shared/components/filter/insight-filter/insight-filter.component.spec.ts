import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightFilterComponent } from './insight-filter.component';

describe('InsightFilterComponent', () => {
  let component: InsightFilterComponent;
  let fixture: ComponentFixture<InsightFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsightFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
