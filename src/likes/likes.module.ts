import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Likes } from './entities/like.entity';
import { BoardLikesService } from './boardlikes.service';
import { BoardsModule } from '../boards/boards.module';

@Module({
  imports: [
    BoardsModule,
    TypeOrmModule.forFeature([Likes]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [LikesController],
  providers: [LikesService, BoardLikesService],
})
export class LikesModule {}
