import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinImageDisplayDialogComponent } from './coin-image-display-dialog.component';

describe('CoinImageDisplayDialogComponent', () => {
  let component: CoinImageDisplayDialogComponent;
  let fixture: ComponentFixture<CoinImageDisplayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinImageDisplayDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinImageDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
