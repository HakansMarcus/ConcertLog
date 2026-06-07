import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandPage } from './bandpage';

describe('Bandpage', () => {
  let component: BandPage;
  let fixture: ComponentFixture<BandPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BandPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
