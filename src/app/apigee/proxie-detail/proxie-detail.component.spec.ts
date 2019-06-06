import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxieDetailComponent } from './proxie-detail.component';

describe('ProxieDetailComponent', () => {
  let component: ProxieDetailComponent;
  let fixture: ComponentFixture<ProxieDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProxieDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxieDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
