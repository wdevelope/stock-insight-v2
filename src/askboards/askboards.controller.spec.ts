import { Test, TestingModule } from '@nestjs/testing';
import { AskboardsController } from './askboards.controller';
import { AskboardsService } from './askboards.service';

describe('AskboardsController', () => {
  let controller: AskboardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AskboardsController],
      providers: [AskboardsService],
    }).compile();

    controller = module.get<AskboardsController>(AskboardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
