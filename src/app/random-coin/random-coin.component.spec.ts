import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomCoinComponent } from './random-coin.component';

describe('RandomCoinComponent', () => {
  let component: RandomCoinComponent;
  let fixture: ComponentFixture<RandomCoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomCoinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
