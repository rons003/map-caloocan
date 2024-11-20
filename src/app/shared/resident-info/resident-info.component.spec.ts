import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentInfoComponent } from './resident-info.component';

describe('ResidentInfoComponent', () => {
  let component: ResidentInfoComponent;
  let fixture: ComponentFixture<ResidentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
