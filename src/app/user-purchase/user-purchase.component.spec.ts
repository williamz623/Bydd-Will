import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPurchaseComponent } from './user-purchase.component';

describe('UserPurchaseComponent', () => {
  let component: UserPurchaseComponent;
  let fixture: ComponentFixture<UserPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
