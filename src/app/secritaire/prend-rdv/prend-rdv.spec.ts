import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendRDV } from './prend-rdv';

describe('PrendRDV', () => {
  let component: PrendRDV;
  let fixture: ComponentFixture<PrendRDV>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrendRDV]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrendRDV);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
