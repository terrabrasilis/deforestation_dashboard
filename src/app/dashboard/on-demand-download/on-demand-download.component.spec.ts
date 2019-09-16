import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnDemandDownloadComponent } from './on-demand-download.component';

describe('OnDemandDownloadComponent', () => {
  let component: OnDemandDownloadComponent;
  let fixture: ComponentFixture<OnDemandDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnDemandDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnDemandDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
