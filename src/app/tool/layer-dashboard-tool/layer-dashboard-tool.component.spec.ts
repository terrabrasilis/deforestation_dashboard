import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerDashboardToolComponent } from './layer-dashboard-tool.component';

describe('LayerDashboardToolComponent', () => {
  let component: LayerDashboardToolComponent;
  let fixture: ComponentFixture<LayerDashboardToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerDashboardToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerDashboardToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
