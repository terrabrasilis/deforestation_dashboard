import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerLegendToolComponent } from './layer-legend-tool.component';

describe('LayerLegendToolComponent', () => {
  let component: LayerLegendToolComponent;
  let fixture: ComponentFixture<LayerLegendToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerLegendToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerLegendToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
