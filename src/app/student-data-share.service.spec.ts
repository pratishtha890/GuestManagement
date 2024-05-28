import { TestBed } from '@angular/core/testing';

import { StudentDataShareService } from './student-data-share.service';

describe('StudentDataShareService', () => {
  let service: StudentDataShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentDataShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
