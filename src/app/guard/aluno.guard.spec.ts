import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { alunoGuard } from './aluno.guard';

describe('alunoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => alunoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
