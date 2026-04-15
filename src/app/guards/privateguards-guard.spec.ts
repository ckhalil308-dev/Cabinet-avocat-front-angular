import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { privateguardsGuard } from './privateguards-guard';

describe('privateguardsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => privateguardsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
