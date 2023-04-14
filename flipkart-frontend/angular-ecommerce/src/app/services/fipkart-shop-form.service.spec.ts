import { TestBed } from '@angular/core/testing';

import { FipkartShopFormService } from './fipkart-shop-form.service';

describe('FipkartShopFormService', () => {
  let service: FipkartShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FipkartShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
