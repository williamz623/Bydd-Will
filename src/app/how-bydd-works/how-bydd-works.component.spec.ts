import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowByddWorksComponent } from './how-bydd-works.component';

describe('HowByddWorksComponent', () => {
  let component: HowByddWorksComponent;
  let fixture: ComponentFixture<HowByddWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowByddWorksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowByddWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
