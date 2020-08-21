import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserOrganizationComponent } from './add-user-organization.component';

describe('AddUserOrganizationComponent', () => {
  let component: AddUserOrganizationComponent;
  let fixture: ComponentFixture<AddUserOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
