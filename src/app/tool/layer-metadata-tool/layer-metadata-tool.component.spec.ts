import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerMetadataToolComponent } from './layer-metadata-tool.component';

describe('LayerMetadataToolComponent', () => {
  let component: LayerMetadataToolComponent;
  let fixture: ComponentFixture<LayerMetadataToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerMetadataToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerMetadataToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
