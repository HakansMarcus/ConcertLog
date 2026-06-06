import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBand } from './add-band';

describe('AddBand', () => {
  let component: AddBand;
  let fixture: ComponentFixture<AddBand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
