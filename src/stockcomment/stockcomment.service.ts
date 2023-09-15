import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Users } from 'src/users/users.entity';
import { StockCommentDto } from './dto/stockcomment.dto';
import { StockCommentRepository } from './stockcomment.repository';
import { StockComment } from './entities/stockcomment.entity';

@Injectable()
export class StockCommentService {
  constructor(private stockcommentRepository: StockCommentRepository) {}

  async create(
    user: Users,
    stockcommentDto: StockCommentDto,
    id: string,
  ): Promise<void> {
    const existedstock = await this.stockcommentRepository.findstock(id);
    if (!existedstock) {
      throw new NotFoundException('주식이 존재하지 않습니다.');
    }
    await this.stockcommentRepository.save(user, stockcommentDto, existedstock);
  }

  async findAllByStock(id: string): Promise<StockComment[]> {
    const stock = await this.stockcommentRepository.findstock(id);
    if (!stock) {
      throw new NotFoundException('주식이 존재하지 않습니다.');
    }

    return await this.stockcommentRepository.findWithUserNickname(id);
  }

  async update(
    user: Users,
    id: string,
    stockcommentId: number,
    stockcommentDto: StockCommentDto,
  ): Promise<void> {
    const stockcomment = await this.stockcommentRepository.findOne({
      where: {
        id: stockcommentId,
        stock: { id: id },
        user: { id: user.id },
      },
    });
    if (!stockcomment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }
    try {
      await this.stockcommentRepository.update(stockcommentDto, stockcommentId);
    } catch (error) {
      throw new BadRequestException('SERVICE_ERROR');
    }
  }

  async remove(user: Users, id: string, stockcommentId: number): Promise<void> {
    const existedstockcomment = await this.stockcommentRepository.findOne({
      where: {
        id: stockcommentId,
        stock: { id: id },
        user: { id: user.id },
      },
    });

    if (!existedstockcomment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    await this.stockcommentRepository.remove(existedstockcomment);
  }
}
