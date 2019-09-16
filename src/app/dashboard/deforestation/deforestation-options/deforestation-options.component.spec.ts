import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeforestationOptionsComponent } from './deforestation-options.component';

describe('DeforestationOptionsComponent', () => {
  let component: DeforestationOptionsComponent;
  let fixture: ComponentFixture<DeforestationOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeforestationOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeforestationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
