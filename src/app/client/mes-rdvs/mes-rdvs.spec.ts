import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesRdvs } from './mes-rdvs';

describe('MesRdvs', () => {
  let component: MesRdvs;
  let fixture: ComponentFixture<MesRdvs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesRdvs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesRdvs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
