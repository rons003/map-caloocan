import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerManagementComponent } from './tracker-management.component';

describe('TrackerManagementComponent', () => {
  let component: TrackerManagementComponent;
  let fixture: ComponentFixture<TrackerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
