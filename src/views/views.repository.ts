import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Views } from './entities/view.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { BoardsService } from 'src/boards/boards.service';
import { Users } from 'src/users/users.entity';

@Injectable()
export class ViewsRepository {
  constructor(
    @InjectRepository(Views)
    private viewsRepository: Repository<Views>,
    private boardsService: BoardsService,
  ) {}

  async findViewsByBoardId(boardId: number): Promise<Views[]> {
    return this.viewsRepository.find({ where: { board: { id: boardId } } });
  }

  async findBoard(board: number) {
    try {
      return await this.boardsService.findOne(board);
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async create(user: Users, boardId: number): Promise<void> {
    try {
      await this.viewsRepository.save({
        user: user,
        board: { id: boardId },
        count: 1,
      });
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async findOne(options: FindOneOptions<Views>): Promise<Views | undefined> {
    try {
      return await this.viewsRepository.findOne(options);
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }

  async update(viewId: number, cnt: number): Promise<void> {
    try {
      await this.viewsRepository
        .createQueryBuilder()
        .update(Views)
        .set({
          count: cnt + 1,
        })
        .where('id = :id', { id: viewId })
        .execute();
    } catch (error) {
      throw new BadRequestException('REPOSITORY_ERROR');
    }
  }
}
