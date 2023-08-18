import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { TypeOrmConfig } from 'config/typeorm.config';
import { AppController } from './app.controller';
import { LikesModule } from './likes/likes.module';
>>>>>>>>> Temporary merge branch 2

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
  providers: [],
})
export class AppModule {}
