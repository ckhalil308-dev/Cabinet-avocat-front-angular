import { TestBed } from '@angular/core/testing';

import { ServiceUser } from './service-user';

describe('ServiceUser', () => {
  let service: ServiceUser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceUser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
