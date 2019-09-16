import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrabrasilisApiComponent } from './terrabrasilis-api.component';

describe('TerrabrasilisApiComponent', () => {
  let component: TerrabrasilisApiComponent;
  let fixture: ComponentFixture<TerrabrasilisApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerrabrasilisApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerrabrasilisApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
