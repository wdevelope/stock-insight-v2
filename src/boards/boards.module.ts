import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { CommentsModule } from 'src/comments/comments.module';
config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    JwtModule.register({
      secret: process.env.DATABASE_SECRET_KEY,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
    CommentsModule,
  ],
  exports: [TypeOrmModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
