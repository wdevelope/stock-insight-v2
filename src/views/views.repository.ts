import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Views } from './entities/view.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Users } from 'src/users/users.entity';
import { BoardsRepository } from 'src/boards/boards.repository';
import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';

@Injectable()
export class ViewsRepository {
  constructor(
    @InjectRepository(Views)
    private viewsRepository: Repository<Views>,
    private boardsRepository: BoardsRepository,
  ) {}

  async findViewsByBoardId(boardId: number): Promise<Views[]> {
    return this.viewsRepository.find({ where: { board: { id: boardId } } });
  }

  async findBoard(boardId: number) {
    try {
      return await this.boardsRepository.findOne({ where: { id: boardId } });
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }

  async create(user: Users, boardId: number): Promise<void> {
    try {
      await this.viewsRepository.save({
        user: user,
        board: { id: boardId },
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

  async update(boardId: number, updateBoardDto: UpdateBoardDto) {
    try {
      await this.boardsRepository.update(updateBoardDto, boardId);
    } catch (error) {
      throw new BadGatewayException('REPOSITORY_ERROR');
    }
  }
}
