import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    JwtModule.register({
      secret: process.env.DATABASE_SECRET_KEY,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
