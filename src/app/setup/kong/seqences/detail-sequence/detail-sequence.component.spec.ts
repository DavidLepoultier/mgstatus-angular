import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSequenceComponent } from './detail-sequence.component';

describe('DetailSequenceComponent', () => {
  let component: DetailSequenceComponent;
  let fixture: ComponentFixture<DetailSequenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSequenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
