import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerDownloadToolComponent } from './layer-download-tool.component';

describe('LayerDownloadToolComponent', () => {
  let component: LayerDownloadToolComponent;
  let fixture: ComponentFixture<LayerDownloadToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerDownloadToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerDownloadToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
