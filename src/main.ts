import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 정적 파일 제공
  app.use('/static', express.static(join(__dirname, '..', '..', 'public')));

  await app.listen(process.env.SERVER_PORT);
}

bootstrap();
