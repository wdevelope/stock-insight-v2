import { BadGatewayException, Injectable } from '@nestjs/common';
import { Likes } from './entities/like.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { BoardsRepository } from 'src/boards/boards.repository';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
    private boardsRepository: BoardsRepository,
  ) {}

  async findBoard(boardId: number) {
    try {
      return await this.boardsRepository.findOne({ where: { id: boardId } });
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }

  async findOne(options: FindOneOptions<Likes>): Promise<Likes | undefined> {
    try {
      return await this.likesRepository.findOne(options);
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }

  async find(options: FindOneOptions<Likes>): Promise<Likes[] | undefined> {
    try {
      return await this.likesRepository.find(options);
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }

  async remove(likeFind: Likes): Promise<void> {
    try {
      await this.likesRepository.remove(likeFind);
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }

  async save(user: Users, boardId: number): Promise<void> {
    try {
      await this.likesRepository.save({
        user: user,
        board: { id: boardId },
      });
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }

  async update(boardId: number, updateBoardDto: UpdateBoardDto) {
    try {
      await this.boardsRepository.update(updateBoardDto, boardId);
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }

  async incrementLikes(boardId: number): Promise<void> {
    try {
      await this.boardsRepository.incrementLikes(boardId);
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }

  async decrementLikes(boardId: number): Promise<void> {
    try {
      await this.boardsRepository.decrementLikes(boardId);
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }
}
