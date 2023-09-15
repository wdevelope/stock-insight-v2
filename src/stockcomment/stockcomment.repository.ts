import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { StockComment } from './entities/stockcomment.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { StockCommentDto } from './dto/stockcomment.dto';

@Injectable()
export class StockCommentRepository {
  constructor(
    @InjectRepository(StockComment)
    private stockCommentRepository: Repository<StockComment>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async findstock(id: string): Promise<Stock> {
    return await this.stockRepository.findOne({ where: { id } });
  }

  async findWithUserNickname(id: string): Promise<any> {
    return await this.stockCommentRepository
      .createQueryBuilder('stockComment')
      .leftJoinAndSelect(
        'stockComment.user',
        'user',
        'user.id = stockComment.userId',
      )
      .addSelect(['user.nickname']) // nickname만 선택하여 가져옵니다.
      .where('stockComment.id = :id', { id })
      .getMany();
  }

  async find(option: FindOneOptions<StockComment>): Promise<any> {
    return await this.stockCommentRepository.find(option);
  }

  async findOne(option: FindOneOptions<StockComment>): Promise<any> {
    return await this.stockCommentRepository.findOne(option);
  }

  async save(
    user: Users,
    stockCommentDto: StockCommentDto,
    stock: Stock,
  ): Promise<void> {
    await this.stockCommentRepository.save({
      comment: stockCommentDto.comment,
      stock: stock,
      user: user,
    });
  }

  async update(
    stockCommentDto: StockCommentDto,
    stockCommentId: number,
  ): Promise<void> {
    await this.stockCommentRepository
      .createQueryBuilder()
      .update(StockComment)
      .set({
        comment: stockCommentDto.comment,
      })
      .where('id=:id', { id: stockCommentId })
      .execute();
  }

  async remove(existedcomment): Promise<void> {
    await this.stockCommentRepository.manager.transaction(
      async (transaction) => {
        await transaction.remove(existedcomment);
      },
    );
  }
}
