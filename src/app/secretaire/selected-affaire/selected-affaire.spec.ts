import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedAffaire } from './selected-affaire';

describe('SelectedAffaire', () => {
  let component: SelectedAffaire;
  let fixture: ComponentFixture<SelectedAffaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedAffaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedAffaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
