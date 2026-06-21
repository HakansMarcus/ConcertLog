import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedConcerts } from './plannedconcerts';

describe('Plannedconcerts', () => {
  let component: PlannedConcerts;
  let fixture: ComponentFixture<PlannedConcerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannedConcerts],
    }).compileComponents();

    fixture = TestBed.createComponent(PlannedConcerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
