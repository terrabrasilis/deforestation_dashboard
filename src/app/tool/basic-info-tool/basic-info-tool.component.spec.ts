import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoToolComponent } from './basic-info-tool.component';

describe('BasicInfoToolComponent', () => {
  let component: BasicInfoToolComponent;
  let fixture: ComponentFixture<BasicInfoToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInfoToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInfoToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
