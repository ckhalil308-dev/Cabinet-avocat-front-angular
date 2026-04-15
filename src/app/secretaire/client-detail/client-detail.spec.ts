import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CLientDetail } from './client-detail';

describe('CLientDetail', () => {
  let component: CLientDetail;
  let fixture: ComponentFixture<CLientDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CLientDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CLientDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
