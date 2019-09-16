import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerRemoveToolComponent } from './layer-remove-tool.component';

describe('LayerRemoveToolComponent', () => {
  let component: LayerRemoveToolComponent;
  let fixture: ComponentFixture<LayerRemoveToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerRemoveToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerRemoveToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
