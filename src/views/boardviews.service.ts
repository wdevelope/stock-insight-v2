import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Views } from './entities/view.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { BoardsService } from 'src/boards/boards.service';
import { Users } from 'src/users/users.entity';

@Injectable()
export class BoardViewsService {
  constructor(
    @InjectRepository(Views)
    private boardViewsRepository: Repository<Views>,
    private boardsService: BoardsService,
  ) {}

  async findBoard(board: number) {
    return await this.boardsService.findOne(board);
  }

  async create(user: Users, boardId: number): Promise<void> {
    await this.boardViewsRepository.save({
      user: user,
      board: { id: boardId },
      count: 1,
    });
  }

  async findOne(options: FindOneOptions<Views>): Promise<Views | undefined> {
    return await this.boardViewsRepository.findOne(options);
  }

  async update(viewId: number, cnt: number): Promise<void> {
    console.log(viewId);
    await this.boardViewsRepository
      .createQueryBuilder()
      .update(Views)
      .set({
        count: cnt + 1,
      })
      .where('id = :id', { id: viewId })
      .execute();
  }
}
