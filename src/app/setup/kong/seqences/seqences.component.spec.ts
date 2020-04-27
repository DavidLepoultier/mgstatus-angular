import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeqencesComponent } from './seqences.component';

describe('SeqencesComponent', () => {
  let component: SeqencesComponent;
  let fixture: ComponentFixture<SeqencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeqencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeqencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
