/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewUserTenantService } from './new-user-tenant.service';

describe('Service: NewUserTenant', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewUserTenantService]
    });
  });

  it('should ...', inject([NewUserTenantService], (service: NewUserTenantService) => {
    expect(service).toBeTruthy();
  }));
});
