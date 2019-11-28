import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProxiesComponent } from './my-proxies.component';

describe('MyProxiesComponent', () => {
  let component: MyProxiesComponent;
  let fixture: ComponentFixture<MyProxiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProxiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProxiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
