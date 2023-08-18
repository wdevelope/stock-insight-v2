import { Injectable } from '@nestjs/common';
import { Likes } from './entities/like.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { BoardsService } from 'src/boards/boards.service';
@Injectable()
export class BoardLikesService {
  constructor(
    @InjectRepository(Likes)
    private boardLikesRepository: Repository<Likes>,
    private boardsService: BoardsService,
  ) {}

  async findBoard(board: number) {
    return await this.boardsService.findOne(board);
  }

  async findOne(options: FindOneOptions<Likes>): Promise<Likes | undefined> {
    return await this.boardLikesRepository.findOne(options);
  }

  async find(options: FindOneOptions<Likes>): Promise<Likes[] | undefined> {
    return await this.boardLikesRepository.find(options);
  }

  async remove(likeFind: Likes): Promise<void> {
    await this.boardLikesRepository.remove(likeFind);
  }

  async save(user: Users, board: number): Promise<void> {
    console.log(board);
    await this.boardLikesRepository.save({
      user: user,
      board: { id: board },
    });
  }
}
