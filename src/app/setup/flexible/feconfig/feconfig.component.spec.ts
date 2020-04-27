import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeconfigComponent } from './feconfig.component';

describe('FeconfigComponent', () => {
  let component: FeconfigComponent;
  let fixture: ComponentFixture<FeconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
