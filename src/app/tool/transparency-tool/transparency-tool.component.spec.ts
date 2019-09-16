import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparencyToolComponent } from './transparency-tool.component';

describe('TransparencyToolComponent', () => {
  let component: TransparencyToolComponent;
  let fixture: ComponentFixture<TransparencyToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransparencyToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransparencyToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
