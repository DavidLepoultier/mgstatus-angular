import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDeploymentComponent } from './detail-deployment.component';

describe('DetailDeploymentComponent', () => {
  let component: DetailDeploymentComponent;
  let fixture: ComponentFixture<DetailDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
