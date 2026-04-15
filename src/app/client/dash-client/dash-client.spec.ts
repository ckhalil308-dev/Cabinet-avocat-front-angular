import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashClient } from './dash-client';

describe('DashClient', () => {
  let component: DashClient;
  let fixture: ComponentFixture<DashClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
