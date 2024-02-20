import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionalPoliciesComponent } from './transactional-policies.component';

describe('TransactionalPoliciesComponent', () => {
  let component: TransactionalPoliciesComponent;
  let fixture: ComponentFixture<TransactionalPoliciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionalPoliciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionalPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
