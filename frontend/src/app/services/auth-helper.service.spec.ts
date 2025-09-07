/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthHelperService } from './auth-helper.service';

describe('Service: AuthHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthHelperService]
    });
  });

  it('should ...', inject([AuthHelperService], (service: AuthHelperService) => {
    expect(service).toBeTruthy();
  }));
});
