import { TestBed } from '@angular/core/testing';

import { UserIngredientService } from './user-ingredient.service';

describe('UserIngredientService', () => {
  let service: UserIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
