import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { logadoGuard } from './logado.guard';

describe('logadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => logadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
