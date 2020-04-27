import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexibleComponent } from './flexible.component';

describe('FlexibleComponent', () => {
  let component: FlexibleComponent;
  let fixture: ComponentFixture<FlexibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
