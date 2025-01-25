import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmConfig } from 'config/typeorm.config';
import { EmailService } from './users/email/email.service';
import { AppController } from './app.controller';
import { LikesModule } from './likes/likes.module';
import { ViewsModule } from './views/views.module';
import { NoticeboardsModule } from './noticeboards/noticeboards.module';
import { StockModule } from './stock/stock.module';
import { EventsModule } from './events/events.module';
import { UploadModule } from './upload/upload.module';
import { QuizModule } from './quiz/quiz.module';
import { AskboardsModule } from './askboards/askboards.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { ExceptionModule } from './exception/exception.module';
import { ChatGateway } from './chat/chat.gateway';
import { NewsModule } from './news/news.module';
import { AlertGateway } from './alert/alert.gateway';
import { StockCommentModule } from './stockcomment/stockcomment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    UsersModule,
    BoardsModule,
    CommentsModule,
    LikesModule,
    ViewsModule,
    NoticeboardsModule,
    StockModule,
    EventsModule,
    UploadModule,
    QuizModule,
    AskboardsModule,
    ExceptionModule,
    NewsModule,
    StockCommentModule,
  ],
  controllers: [AppController],
  providers: [
    EmailService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    ChatGateway,
    AlertGateway,
  ],
})
export class AppModule {}
