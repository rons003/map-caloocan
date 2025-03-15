import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentInfoAttachmentComponent } from './resident-info-attachment.component';

describe('ResidentInfoAttachmentComponent', () => {
  let component: ResidentInfoAttachmentComponent;
  let fixture: ComponentFixture<ResidentInfoAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentInfoAttachmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidentInfoAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
