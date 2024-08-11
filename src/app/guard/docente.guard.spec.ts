import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { docenteGuard } from './docente.guard';

describe('docenteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => docenteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
