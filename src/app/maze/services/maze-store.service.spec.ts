import { TestBed } from '@angular/core/testing';

import { MazeStoreService } from './maze-store.service';

describe('MazeStoreService', () => {
  let service: MazeStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MazeStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
