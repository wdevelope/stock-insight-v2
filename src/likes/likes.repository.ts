import { Injectable } from '@nestjs/common';
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
    return await this.boardsRepository.findOne({ where: { id: boardId } });
  }

  async findOne(options: FindOneOptions<Likes>): Promise<Likes | undefined> {
    return await this.likesRepository.findOne(options);
  }

  async find(options: FindOneOptions<Likes>): Promise<Likes[] | undefined> {
    return await this.likesRepository.find(options);
  }

  async remove(likeFind: Likes): Promise<void> {
    await this.likesRepository.remove(likeFind);
  }

  async save(user: Users, boardId: number): Promise<void> {
    await this.likesRepository.save({
      user: user,
      board: { id: boardId },
    });
  }

  async update(boardId: number, updateBoardDto: UpdateBoardDto) {
    await this.boardsRepository.update(updateBoardDto, boardId);
  }
}
