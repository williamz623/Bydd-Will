import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySucceedDialogComponent } from './buy-succeed-dialog.component';

describe('BuySucceedDialogComponent', () => {
  let component: BuySucceedDialogComponent;
  let fixture: ComponentFixture<BuySucceedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuySucceedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuySucceedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
