import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCoinListComponent } from './company-coin-list.component';

describe('CompanyCoinListComponent', () => {
  let component: CompanyCoinListComponent;
  let fixture: ComponentFixture<CompanyCoinListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCoinListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCoinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
