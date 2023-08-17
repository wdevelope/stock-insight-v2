import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<void> {
    await this.boardsRepository.save(createBoardDto);
  }

  findAll(): Promise<Board[]> {
    return this.boardsRepository.find();
  }

  async findOne(id: number): Promise<Board> {
    console.log(id);
    return await this.boardsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBoardDto: UpdateBoardDto): Promise<void> {
    const existedBoard = await this.findOne(id);
    if (!existedBoard) {
      throw new NotFoundException();
    }
    await this.boardsRepository
      .createQueryBuilder()
      .update(Board)
      .set({
        title: updateBoardDto.title,
        description: updateBoardDto.description,
        image: updateBoardDto.image,
        join: updateBoardDto.join,
      })
      .where('id=:id', { id })
      .execute();
  }

  async remove(id: number): Promise<void> {
    await this.boardsRepository.delete(id);
  }
}
