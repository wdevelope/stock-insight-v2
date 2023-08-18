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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    UsersModule,
    BoardsModule,
    CommentsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [EmailService],
})
export class AppModule {}
