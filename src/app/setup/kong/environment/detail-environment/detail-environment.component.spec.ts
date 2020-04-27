import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEnvironmentComponent } from './detail-environment.component';

describe('DetailEnvironmentComponent', () => {
  let component: DetailEnvironmentComponent;
  let fixture: ComponentFixture<DetailEnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailEnvironmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
