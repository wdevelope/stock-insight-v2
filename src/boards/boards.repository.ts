import { BadRequestException, Injectable } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { Users } from 'src/users/users.entity';

@Injectable()
export class BoardsRepository {
  constructor(
    @InjectRepository(Board)
    private boardsRepository: Repository<Board>,
  ) {}

  // async find(): Promise<Board[] | undefined> {
  //   try {
  //     return this.boardsRepository.find();
  //   } catch (error) {
  //     throw new BadRequestException('REPOSITORY_ERROR');
  //   }
  // }

  async find(option: FindOneOptions<Board>): Promise<Board[] | undefined> {
    try {
      return this.boardsRepository.find(option);
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async findOne(option: FindOneOptions<Board>): Promise<Board | undefined> {
    try {
      return this.boardsRepository.findOne(option);
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async save(createBoardDto: CreateBoardDto, user: Users): Promise<void> {
    try {
      await this.boardsRepository.save({
        title: createBoardDto.title,
        description: createBoardDto.description,
        image: createBoardDto.image,
        likeCount: createBoardDto.likeCount,
        user: user,
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async update(updateBoardDto: UpdateBoardDto, boardId: number): Promise<void> {
    try {
      await this.boardsRepository
        .createQueryBuilder()
        .update(Board)
        .set({
          title: updateBoardDto.title,
          description: updateBoardDto.description,
          image: updateBoardDto.image,
          likeCount: updateBoardDto.likeCount,
        })
        .where('id=:id', { id: boardId })
        .execute();
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async remove(existedBoard): Promise<void> {
    try {
      await this.boardsRepository.manager.transaction(async (transaction) => {
        await transaction.remove(existedBoard);
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }
}
