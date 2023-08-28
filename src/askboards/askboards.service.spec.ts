import { Test, TestingModule } from '@nestjs/testing';
import { AskboardsService } from './askboards.service';

describe('AskboardsService', () => {
  let service: AskboardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AskboardsService],
    }).compile();

    service = module.get<AskboardsService>(AskboardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
