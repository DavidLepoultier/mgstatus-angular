import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KongComponent } from './kong.component';

describe('KongComponent', () => {
  let component: KongComponent;
  let fixture: ComponentFixture<KongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
