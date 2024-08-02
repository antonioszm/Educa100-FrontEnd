import { TestBed } from '@angular/core/testing';

import { TurmasService } from './turma.service';

describe('TurmasService', () => {
  let service: TurmasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurmasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
