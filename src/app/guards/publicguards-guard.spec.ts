import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { publicguardsGuard } from './publicguards-guard';

describe('publicguardsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => publicguardsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
