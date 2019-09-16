import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoiSearchComponent } from './loi-search.component';

describe('LoiSearchComponent', () => {
  let component: LoiSearchComponent;
  let fixture: ComponentFixture<LoiSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoiSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
