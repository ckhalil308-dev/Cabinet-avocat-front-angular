import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Affaire } from './affaire';

describe('Affaire', () => {
  let component: Affaire;
  let fixture: ComponentFixture<Affaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Affaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Affaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
