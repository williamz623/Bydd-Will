import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSucceedDialogComponent } from './register-succeed-dialog.component';

describe('RegisterSucceedDialogComponent', () => {
  let component: RegisterSucceedDialogComponent;
  let fixture: ComponentFixture<RegisterSucceedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterSucceedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterSucceedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
