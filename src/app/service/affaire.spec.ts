import { TestBed } from '@angular/core/testing';

import { Affaire } from './affaire';

describe('Affaire', () => {
  let service: Affaire;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Affaire);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
