import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KubeconfigComponent } from './kubeconfig.component';

describe('KubeconfigComponent', () => {
  let component: KubeconfigComponent;
  let fixture: ComponentFixture<KubeconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KubeconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KubeconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
