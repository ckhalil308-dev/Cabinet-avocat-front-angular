import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashSecretaire } from './dash-secretaire';

describe('DashSecretaire', () => {
  let component: DashSecretaire;
  let fixture: ComponentFixture<DashSecretaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashSecretaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashSecretaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
