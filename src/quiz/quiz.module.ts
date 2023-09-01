import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizRepository } from './quiz.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { StockModule } from 'src/stock/stock.module';
import { Quiz } from './quiz.entity';
import { StockService } from 'src/stock/stock.service';
import { Stock } from 'src/stock/entities/stock.entity';
import { StockPrice } from 'src/stock/entities/stockPrice.entity';
import { MyStock } from 'src/stock/entities/myStock.entity';
import { QuizCount } from './quizCount.entity';

@Module({
  imports: [
    StockModule,
    UsersModule,
    TypeOrmModule.forFeature([Quiz, Stock, StockPrice, MyStock, QuizCount]),
  ],
  controllers: [QuizController],
  providers: [QuizService, QuizRepository, StockService],
  exports: [QuizService, QuizRepository],
})
export class QuizModule {}
