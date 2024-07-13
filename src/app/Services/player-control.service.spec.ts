import { TestBed } from '@angular/core/testing';

import { PlayerControlService } from './player-control.service';

describe('PlayerControlService', () => {
  let service: PlayerControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
