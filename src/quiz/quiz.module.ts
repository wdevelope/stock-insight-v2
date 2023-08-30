import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuizRepository } from './quiz.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { StockModule } from 'src/stock/stock.module';
import { Quiz } from './quiz.entity';

@Module({
  imports: [StockModule, UsersModule, TypeOrmModule.forFeature([Quiz])],
  controllers: [QuizController],
  providers: [QuizService, QuizRepository],
  exports: [QuizService, QuizRepository],
})
export class QuizModule {}
