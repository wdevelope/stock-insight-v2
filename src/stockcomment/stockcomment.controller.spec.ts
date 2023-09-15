import { Test, TestingModule } from '@nestjs/testing';
import { StockcommentController } from './stockcomment.controller';
import { StockcommentService } from './stockcomment.service';

describe('StockcommentController', () => {
  let controller: StockcommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockcommentController],
      providers: [StockcommentService],
    }).compile();

    controller = module.get<StockcommentController>(StockcommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
