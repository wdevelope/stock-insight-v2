import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { StockComment } from './entities/stockcomment.entity';
import { StockCommentController } from './stockcomment.controller';
import { StockCommentService } from './stockcomment.service';
import { StockCommentRepository } from './stockcomment.repository';
import { StockModule } from 'src/stock/stock.module';
import { Stock } from 'src/stock/entities/stock.entity';

@Module({
  imports: [
    StockModule,
    TypeOrmModule.forFeature([StockComment, Stock]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.DATABASE_EXPIRESIN },
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [StockCommentController],
  providers: [StockCommentService, StockCommentRepository],
})
export class StockCommentModule {}
