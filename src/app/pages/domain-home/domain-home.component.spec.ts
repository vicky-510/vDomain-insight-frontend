import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainHomeComponent } from './domain-home.component';

describe('DomainHomeComponent', () => {
  let component: DomainHomeComponent;
  let fixture: ComponentFixture<DomainHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DomainHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
