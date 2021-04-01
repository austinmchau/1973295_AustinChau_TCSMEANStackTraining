import { TestBed } from '@angular/core/testing';

import { QuizBackendService } from './quiz-backend.service';

describe('QuizBackendService', () => {
  let service: QuizBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
