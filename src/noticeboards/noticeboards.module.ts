import { Module } from '@nestjs/common';
import { NoticeboardsService } from './noticeboards.service';
import { NoticeboardsController } from './noticeboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoard } from './entities/noticeboard.entity';
import { JwtModule } from '@nestjs/jwt';
import { NoticeBoardsRepository } from './noticeboards.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoticeBoard]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  controllers: [NoticeboardsController],
  providers: [NoticeboardsService, NoticeBoardsRepository],
})
export class NoticeboardsModule {}
