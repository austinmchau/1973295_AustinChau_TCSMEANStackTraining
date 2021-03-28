import { TestBed } from '@angular/core/testing';

import { QuizResolver } from './quiz.resolver';

describe('QuizResolver', () => {
  let resolver: QuizResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(QuizResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
