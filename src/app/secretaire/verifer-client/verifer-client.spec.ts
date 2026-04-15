import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeriferClient } from './verifer-client';

describe('VeriferClient', () => {
  let component: VeriferClient;
  let fixture: ComponentFixture<VeriferClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeriferClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeriferClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
