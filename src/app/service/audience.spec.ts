import { TestBed } from '@angular/core/testing';

import { Audience } from './audience';

describe('Audience', () => {
  let service: Audience;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Audience);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
