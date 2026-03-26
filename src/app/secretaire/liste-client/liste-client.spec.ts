import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeClient } from './liste-client';

describe('ListeClient', () => {
  let component: ListeClient;
  let fixture: ComponentFixture<ListeClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
