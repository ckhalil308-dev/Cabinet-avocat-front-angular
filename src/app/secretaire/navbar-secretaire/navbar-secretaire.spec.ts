import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSecretaire } from './navbar-secretaire';

describe('NavbarSecretaire', () => {
  let component: NavbarSecretaire;
  let fixture: ComponentFixture<NavbarSecretaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarSecretaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarSecretaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
