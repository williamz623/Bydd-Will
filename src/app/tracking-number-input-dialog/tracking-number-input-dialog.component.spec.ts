import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingNumberInputDialogComponent } from './tracking-number-input-dialog.component';

describe('TrackingNumberInputDialogComponent', () => {
  let component: TrackingNumberInputDialogComponent;
  let fixture: ComponentFixture<TrackingNumberInputDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingNumberInputDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingNumberInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
