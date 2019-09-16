import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsSearchComponent } from './wms-search.component';

describe('WmsSearchComponent', () => {
  let component: WmsSearchComponent;
  let fixture: ComponentFixture<WmsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
