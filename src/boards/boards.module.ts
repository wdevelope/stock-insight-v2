import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { JwtModule } from '@nestjs/jwt';
import { BoardsRepository } from './boards.repository';
import { SearchModule } from 'src/search/search.module';
import { BoardSearchService } from 'src/search/search.service';

@Module({
  imports: [
    SearchModule,
    TypeOrmModule.forFeature([Board]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  exports: [TypeOrmModule, BoardsService],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository, BoardSearchService],
})
export class BoardsModule {}
