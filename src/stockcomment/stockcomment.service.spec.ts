import { Test, TestingModule } from '@nestjs/testing';
import { StockcommentService } from './stockcomment.service';

describe('StockcommentService', () => {
  let service: StockcommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockcommentService],
    }).compile();

    service = module.get<StockcommentService>(StockcommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
