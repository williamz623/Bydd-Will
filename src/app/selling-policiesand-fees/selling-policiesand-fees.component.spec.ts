import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingPoliciesandFeesComponent } from './selling-policiesand-fees.component';

describe('SellingPoliciesandFeesComponent', () => {
  let component: SellingPoliciesandFeesComponent;
  let fixture: ComponentFixture<SellingPoliciesandFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellingPoliciesandFeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingPoliciesandFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
