import { BadRequestException, Injectable } from '@nestjs/common';
import { Quiz } from './quiz.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Users } from 'src/users/users.entity';

@Injectable()
export class QuizRepository extends Repository<Quiz> {
  constructor(private readonly dataSource: DataSource) {
    super(Quiz, dataSource.createEntityManager());
  }
  // 정답 제출
  async createQuiz(user: Users, data: CreateQuizDto): Promise<any> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');

    return await this.insert({
      upANDdown: data.upANDdown,
      stockId: data.stockId,
      updated_date: today,
      user,
    });
  }

  //정답 확인
  async updateQuiz(quiz: Quiz, data: UpdateQuizDto): Promise<object> {
    const result = await this.update({ id: quiz.id }, data);
    return result;
  }

  // up, down 각각의 개수의 합
  async getQuiz(): Promise<any> {
    const sum = this.createQueryBuilder('q')
      .select('q.stockName')
      .addSelect('q.upANDdown')
      .addSelect('q.createdAt')
      .addSelect('SUM(q.count)', 'sum')
      .groupBy('q.upANDdown')
      .getRawMany();

    return sum;
  }
}
