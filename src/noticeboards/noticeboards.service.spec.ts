import { Test, TestingModule } from '@nestjs/testing';
import { NoticeboardsService } from './noticeboards.service';

describe('NoticeboardsService', () => {
  let service: NoticeboardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticeboardsService],
    }).compile();

    service = module.get<NoticeboardsService>(NoticeboardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
