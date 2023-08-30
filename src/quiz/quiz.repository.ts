import { Injectable } from '@nestjs/common';
import { Quiz } from './quiz.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Users } from 'src/users/users.entity';
import { Stock } from 'src/stock/entities/stock.entity';

@Injectable()
export class QuizRepository extends Repository<Quiz> {
  constructor(private readonly dataSource: DataSource) {
    super(Quiz, dataSource.createEntityManager());
  }
  // quiz.id
  async findQuizById(id: number): Promise<Quiz | null> {
    const quizId = await this.findOne({ where: { id } });
    return quizId;
  }

  async createQuiz(
    // stock: Stock,
    user: Users,
    data: CreateQuizDto,
  ): Promise<any> {
    return await this.insert({
      upANDdown: data.upANDdown,
      stockName: data.stockName,
      user,
    });
  }
}
