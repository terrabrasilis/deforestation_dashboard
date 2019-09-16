import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeDimensionComponent } from './time-dimension.component';

describe('TimeDimensionComponent', () => {
  let component: TimeDimensionComponent;
  let fixture: ComponentFixture<TimeDimensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeDimensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeDimensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
