import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Views } from './entities/view.entity';
import { BoardsModule } from 'src/boards/boards.module';
import { BoardViewsService } from './boardviews.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 5, // Throttle 시간 (초 단위)
      limit: 5, // 요청 제한 수
    }),
    BoardsModule,
    TypeOrmModule.forFeature([Views]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  controllers: [ViewsController],
  providers: [ViewsService, BoardViewsService],
})
export class ViewsModule {}
