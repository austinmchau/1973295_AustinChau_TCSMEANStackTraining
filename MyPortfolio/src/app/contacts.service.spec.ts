import { TestBed } from '@angular/core/testing';

import { ContactsService } from './contacts.service';

describe('ContactsServiceService', () => {
  let service: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
