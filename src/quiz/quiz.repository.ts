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

    // return await this.insert({
    //   upANDdown: data.upANDdown,
    //   stockId: data.stockId,
    //   updated_date: today,
    //   user,
    // });

    try {
      await this.dataSource.manager.transaction(async (transaction) => {
        await transaction
          .createQueryBuilder()
          .insert()
          .into(Quiz)
          .values({
            upANDdown: data.upANDdown,
            stockId: data.stockId,
            updated_date: today,
            user,
          })
          .execute();
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  // 정답 확인
  async updateQuiz(quiz: Quiz, data: UpdateQuizDto): Promise<object> {
    const result = await this.update({ id: quiz.id }, data);
    return result;
  }

  // up 의 개수
  async upQuiz(): Promise<any> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');
    const updated_date = today;

    const upQuiz = await this.createQueryBuilder('q')
      .select('COUNT(*)', 'count')
      .where('q.upANDdown = :upANDdown', { upANDdown: 'up' })
      .andWhere('quiz.updated_date = :updated_date', {
        updated_date: updated_date,
      })
      .getRawOne();

    return upQuiz;
  }

  // down 의 개수
  async downQuiz(): Promise<any> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');
    const updated_date = today;

    const downQuiz = await this.createQueryBuilder('q')
      .select('COUNT(*)', 'count')
      .where('q.upANDdown = :upANDdown', { upANDdown: 'down' })
      .andWhere('quiz.updated_date = :updated_date', {
        updated_date: updated_date,
      })
      .getRawOne();

    return downQuiz;
  }

  // stockId에 맞는 up 의 개수
  async upStockQuiz(stockId: string): Promise<any> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');
    const updated_date = today;

    const upQuiz = await this.createQueryBuilder('q')
      .select('COUNT(*)', 'count')
      .where('q.upANDdown = :upANDdown', { upANDdown: 'up' })
      .andWhere('quiz.updated_date = :updated_date', {
        updated_date: updated_date,
      })
      .andWhere('quiz.stockId = :stockId', { stockId: stockId })
      .getRawOne();

    return upQuiz;
  }

  // stockId에 맞는 down 의 개수
  async downStockQuiz(stockId: string): Promise<any> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');
    const updated_date = today;

    const downQuiz = await this.createQueryBuilder('q')
      .select('COUNT(*)', 'count')
      .where('q.upANDdown = :upANDdown', { upANDdown: 'down' })
      .andWhere('quiz.updated_date = :updated_date', {
        updated_date: updated_date,
      })
      .andWhere('quiz.stockId = :stockId', { stockId: stockId })
      .getRawOne();

    return downQuiz;
  }

  // userId에 맞는 true 의 개수
  async correctQuizTrue(userId: number): Promise<any> {
    const correctTrue = await this.createQueryBuilder('q')
      .select('COUNT(*)', 'count')
      .where('q.correct = :correct', { correct: 'true' })
      .innerJoin('q.user', 'user')
      .andWhere('user.id = :id', { id: userId })
      .getRawMany();

    return correctTrue;
  }

  // userId에 맞는 false 의 개수
  async correctQuizFalse(userId: number): Promise<any> {
    const correctFalse = await this.createQueryBuilder('q')
      .select('COUNT(*)', 'count')
      .where('q.correct = :correct', { correct: 'false' })
      .innerJoin('q.user', 'user')
      .andWhere('user.id = :id', { id: userId })
      .getRawMany();

    return correctFalse;
  }
}
