import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';
import { CommentsRepository } from './comments.repository';
import { BoardsModule } from 'src/boards/boards.module';
import { BoardsRepository } from 'src/boards/boards.repository';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    BoardsModule,
    TypeOrmModule.forFeature([Comment, Notification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, BoardsRepository],
})
export class CommentsModule {}
