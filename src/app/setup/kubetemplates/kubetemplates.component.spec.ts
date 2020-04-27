import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KubetemplatesComponent } from './kubetemplates.component';

describe('KubetemplatesComponent', () => {
  let component: KubetemplatesComponent;
  let fixture: ComponentFixture<KubetemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KubetemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KubetemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
