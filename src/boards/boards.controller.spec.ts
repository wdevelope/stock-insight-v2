import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateBoardDto } from './dto/create-board.dto';
import { AppModule } from 'src/app.module';

describe('BoardsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // AppModule을 가져옵니다.
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('게시물 생성 API 테스트', async () => {
    const createBoardDto: CreateBoardDto = {
      title: '게시물 제목',
      description: '게시물 내용',
      image: '게시물 이미지 URL',
    };

    const response = await request(app.getHttpServer())
      .post('/api/boards')
      .send(createBoardDto);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
  });
});
