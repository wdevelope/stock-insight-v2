import { Test, TestingModule } from '@nestjs/testing';
import { NoticeboardsController } from './noticeboards.controller';
import { NoticeboardsService } from './noticeboards.service';

describe('NoticeboardsController', () => {
  let controller: NoticeboardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeboardsController],
      providers: [NoticeboardsService],
    }).compile();

    controller = module.get<NoticeboardsController>(NoticeboardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
